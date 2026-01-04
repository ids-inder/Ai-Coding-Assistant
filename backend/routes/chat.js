const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const authMiddleware = require('../middleware/auth');
const Project = require('../models/Project');
const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompts for different project types
const getSystemPrompt = (projectType, language) => {
  const basePrompt = `You are an expert AI coding assistant capable of writing code in any programming language. You provide clean, efficient, well-documented code with best practices.`;

  const typePrompts = {
    'web-static': `Focus on creating static websites using HTML, CSS, and JavaScript. Provide responsive designs and modern UI/UX patterns.`,
    'web-dynamic': `Create dynamic web applications with server-side rendering, databases, and APIs. Use modern frameworks and follow MVC architecture.`,
    'web-complex': `Build complex, scalable web applications like e-commerce platforms. Include authentication, payment processing, database design, caching, and microservices architecture when appropriate.`,
    'android-app': `Develop Android applications using Kotlin or Java. Follow Material Design guidelines and Android best practices.`,
    'ios-app': `Create iOS applications using Swift or Objective-C. Follow Apple's Human Interface Guidelines and iOS development best practices.`,
    'desktop-app': `Build cross-platform desktop applications. Consider using Electron, Qt, or native frameworks.`,
    'cli-tool': `Create command-line tools and utilities. Focus on user-friendly interfaces and robust error handling.`,
    'library': `Develop reusable libraries and packages. Emphasize documentation, testing, and API design.`,
  };

  const languagePrompts = {
    'javascript': `Use modern JavaScript (ES6+) with async/await, arrow functions, and destructuring.`,
    'python': `Write Pythonic code following PEP 8 guidelines. Use type hints when appropriate.`,
    'java': `Follow Java best practices with proper OOP design patterns.`,
    'c': `Write efficient C code with proper memory management.`,
    'cpp': `Use modern C++ (C++17/20) with RAII and smart pointers.`,
    'csharp': `Follow C# conventions and leverage .NET framework features.`,
  };

  return `${basePrompt}\n\n${typePrompts[projectType] || ''}\n\n${languagePrompts[language] || ''}\n\nAlways explain your code and provide usage examples when relevant.`;
};

// Chat endpoint
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message, projectId, projectType, language, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation messages
    const messages = conversationHistory || [];
    messages.push({
      role: 'user',
      content: message
    });

    // Get system prompt
    const systemPrompt = getSystemPrompt(projectType || 'other', language || 'javascript');

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      system: systemPrompt,
      messages: messages
    });

    const assistantMessage = response.content[0].text;

    // Save conversation to project if projectId provided
    if (projectId) {
      try {
        const project = await Project.findOne({
          _id: projectId,
          userId: req.user.userId
        });

        if (project) {
          project.conversations.push({
            role: 'user',
            content: message
          });
          project.conversations.push({
            role: 'assistant',
            content: assistantMessage
          });
          await project.save();
        }
      } catch (dbError) {
        console.error('Error saving conversation:', dbError);
        // Continue even if DB save fails
      }
    }

    res.json({
      message: assistantMessage,
      conversationHistory: [
        ...messages,
        {
          role: 'assistant',
          content: assistantMessage
        }
      ]
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Error processing your request',
      details: error.message
    });
  }
});

// Stream chat endpoint for real-time responses
router.post('/stream', authMiddleware, async (req, res) => {
  try {
    const { message, projectType, language, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const messages = conversationHistory || [];
    messages.push({
      role: 'user',
      content: message
    });

    const systemPrompt = getSystemPrompt(projectType || 'other', language || 'javascript');

    // Stream response from Claude
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      system: systemPrompt,
      messages: messages
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    stream.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('Stream chat error:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
});

module.exports = router;
