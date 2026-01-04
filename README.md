# AI Coding Assistant

An advanced AI-powered coding assistant that can code in any programming language and build any type of application - from simple websites to complex systems like e-commerce platforms, mobile apps, and more.

## Features

### Multi-Language Support
- **Languages**: JavaScript, Python, Java, C, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, and more
- **Intelligent Code Generation**: Context-aware code that follows best practices
- **Syntax Highlighting**: Beautiful code display with syntax highlighting for all languages

### Project Types
- **Static Websites**: HTML, CSS, JavaScript
- **Dynamic Web Apps**: Full-stack applications with databases and APIs
- **Complex Web Applications**: E-commerce platforms, social networks, enterprise systems
- **Android Apps**: Kotlin/Java applications following Material Design
- **iOS Apps**: Swift/Objective-C apps following Apple's guidelines
- **Desktop Applications**: Cross-platform desktop apps
- **CLI Tools**: Command-line utilities and scripts
- **Libraries & Packages**: Reusable code libraries

### User-Friendly Interface
- **Modern UI**: Clean, intuitive interface with gradient design
- **Authentication**: Secure login and registration system
- **Project Management**: Organize your coding projects
- **Chat Interface**: Natural conversation with the AI
- **Code Copying**: One-click code copying
- **Conversation History**: All your chats saved per project

### AI-Powered Features
- **Claude 3.5 Sonnet**: Powered by Anthropic's latest AI model
- **Context Awareness**: Understands your project type and language
- **Best Practices**: Generates production-ready code
- **Explanations**: Code comes with clear explanations
- **No Code Length Limits**: Generate as much code as you need

## Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** for database
- **Anthropic Claude API** for AI capabilities
- **JWT** for authentication
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **React** 18 with Hooks
- **React Router** for navigation
- **Axios** for API calls
- **React Markdown** for message rendering
- **Syntax Highlighter** for code display
- **Lucide React** for icons

### Deployment
- **Docker** & Docker Compose
- **Nginx** as reverse proxy
- **Let's Encrypt** SSL certificates

## Quick Start

### Prerequisites
- Node.js 18+ (for local development)
- Docker & Docker Compose (for deployment)
- MongoDB (handled by Docker)
- Anthropic API key

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd Ai-Coding-Assistant
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **MongoDB Setup**
```bash
# Install MongoDB or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions to deploy to ai-coder.gleuhr.com.

**Quick deployment:**
```bash
# On your server
cd /var/www/ai-coding-assistant
docker-compose up -d --build
```

## Usage

### 1. Register/Login
- Open the application
- Create an account or login
- You'll be redirected to the dashboard

### 2. Create a Project
- Click "New Project"
- Choose your project type (web app, mobile app, etc.)
- Select your primary programming language
- Add a description

### 3. Start Coding
- Click on a project or "New Chat"
- Describe what you want to build
- The AI will generate code with explanations
- Copy code snippets with one click

### 4. Example Prompts
- "Create a responsive landing page with HTML, CSS, and JavaScript"
- "Build a REST API with authentication using Node.js"
- "Develop a todo app for Android using Kotlin"
- "Create an e-commerce website with shopping cart"
- "Write a Python script to analyze CSV data"

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Projects
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/files` - Add file to project

### Chat
- `POST /api/chat/message` - Send message to AI
- `POST /api/chat/stream` - Stream AI responses (SSE)

### Health
- `GET /api/health` - API health check

## Configuration

### Environment Variables

**Backend (.env)**
```env
ANTHROPIC_API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/ai-coding-assistant
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://ai-coder.gleuhr.com
```

**Frontend (.env)**
```env
REACT_APP_API_URL=https://ai-coder.gleuhr.com/api
```

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes
- **Helmet**: Security headers
- **CORS**: Configured for your domain
- **Input Validation**: Server-side validation
- **HTTPS**: SSL/TLS encryption
- **XSS Protection**: Content security headers

## Project Structure

```
Ai-Coding-Assistant/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context (Auth)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── nginx-server.conf
├── DEPLOYMENT.md
└── README.md
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Fast Responses**: Claude API provides quick responses
- **Code Streaming**: Real-time streaming for long responses (SSE endpoint available)
- **Optimized Build**: Production builds are minified and optimized
- **CDN Ready**: Static assets can be served via CDN
- **Database Indexing**: MongoDB indexes for fast queries

## Monitoring & Maintenance

### Logs
```bash
# Application logs
docker-compose logs -f

# Nginx logs
tail -f /var/log/nginx/ai-coder-access.log
tail -f /var/log/nginx/ai-coder-error.log
```

### Database Backup
```bash
# Backup
docker exec ai-coder-mongodb mongodump --out /data/backup

# Restore
docker exec ai-coder-mongodb mongorestore /data/backup
```

### Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify ANTHROPIC_API_KEY is set
- Check logs: `docker-compose logs backend`

### Frontend won't build
- Clear node_modules: `rm -rf node_modules && npm install`
- Check REACT_APP_API_URL is set

### Database connection errors
- Ensure MongoDB container is running
- Check MONGODB_URI in .env

### API rate limiting
- Default: 100 requests per 15 minutes
- Adjust in `backend/server.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Roadmap

- [ ] Real-time collaboration
- [ ] Code execution environment
- [ ] Version control integration (Git)
- [ ] Code templates library
- [ ] Export projects as ZIP
- [ ] IDE plugins (VS Code, etc.)
- [ ] Team workspaces
- [ ] Code review features
- [ ] Deployment integrations (Vercel, Netlify, AWS)

## Credits

- **AI**: Anthropic Claude 3.5 Sonnet
- **Icons**: Lucide React
- **Syntax Highlighting**: react-syntax-highlighter
- **Markdown Rendering**: react-markdown

---

**Live Demo**: https://ai-coder.gleuhr.com

Built with ❤️ using Claude AI
