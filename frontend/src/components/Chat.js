import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Code2,
  Send,
  ArrowLeft,
  Copy,
  Check,
  Settings,
  Loader
} from 'lucide-react';
import './Chat.css';

function Chat() {
  const { projectId } = useParams();
  const { API_URL, user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [settings, setSettings] = useState({
    projectType: 'other',
    language: 'javascript'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`);
      setProject(response.data.project);
      setSettings({
        projectType: response.data.project.projectType,
        language: response.data.project.language
      });

      // Load conversation history
      if (response.data.project.conversations) {
        const formattedMessages = response.data.project.conversations.map(conv => ({
          role: conv.role,
          content: conv.content
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await axios.post(`${API_URL}/chat/message`, {
        message: input,
        projectId,
        projectType: settings.projectType,
        language: settings.language,
        conversationHistory
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const examplePrompts = [
    'Create a responsive landing page with HTML, CSS, and JavaScript',
    'Build a REST API with authentication using Node.js and Express',
    'Develop a todo app for Android using Kotlin',
    'Create an e-commerce website with shopping cart functionality',
    'Write a Python script to analyze CSV data',
    'Build a React component with state management'
  ];

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header-left">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            <ArrowLeft size={20} />
            Back
          </button>
          <Code2 size={28} />
          <div>
            <h1>{project ? project.name : 'New Chat'}</h1>
            <p>{user?.username}</p>
          </div>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="btn-settings">
          <Settings size={20} />
          Settings
        </button>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <div className="settings-content">
            <div className="setting-group">
              <label>Project Type</label>
              <select
                value={settings.projectType}
                onChange={(e) => setSettings({ ...settings, projectType: e.target.value })}
              >
                <option value="web-static">Static Website</option>
                <option value="web-dynamic">Dynamic Web App</option>
                <option value="web-complex">Complex Web App (E-commerce, etc.)</option>
                <option value="android-app">Android App</option>
                <option value="ios-app">iOS App</option>
                <option value="desktop-app">Desktop Application</option>
                <option value="cli-tool">CLI Tool</option>
                <option value="library">Library/Package</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Primary Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <Code2 size={64} className="welcome-icon" />
            <h2>Welcome to AI Coding Assistant</h2>
            <p>I can help you code in any language and build any type of application</p>
            <div className="example-prompts">
              <h3>Try asking me to:</h3>
              <div className="prompts-grid">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="example-prompt"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.role === 'assistant' ? (
                  <>
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeString = String(children).replace(/\n$/, '');

                          return !inline && match ? (
                            <div className="code-block">
                              <div className="code-header">
                                <span>{match[1]}</span>
                                <button
                                  onClick={() => handleCopy(codeString, index)}
                                  className="btn-copy"
                                >
                                  {copiedIndex === index ? (
                                    <><Check size={16} /> Copied!</>
                                  ) : (
                                    <><Copy size={16} /> Copy</>
                                  )}
                                </button>
                              </div>
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {codeString}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className="inline-code" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <Loader className="spinner" size={20} />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe what you want to build... (Shift+Enter for new line)"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-send"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default Chat;
