# 🎤 SPECTRE - Advanced Voice AI Assistant

**SPECTRE** is a powerful, real-time voice AI assistant with persistent memory, MCP (Model Context Protocol) integration, and access to 40+ tools across 9 platforms.

![SPECTRE Demo](https://via.placeholder.com/800x400/0a0a0a/00cc99?text=SPECTRE+Voice+AI)

## ✨ Features

### 🧠 **Persistent Memory System**
- **User Session Persistence**: Remembers conversations across sessions
- **localStorage Integration**: Unique user IDs for consistent experience
- **File-based Storage**: JSON memory persistence with auto-save
- **Memory Dashboard**: Visual interface to explore conversation history

### 🔧 **MCP Tool Integration (40+ Tools)**
- **🐙 GitHub**: Repository management, issues, pull requests
- **🚂 Railway**: Cloud deployment, database hosting, domains
- **🎤 ElevenLabs**: Voice synthesis, speech-to-text, voice cloning
- **⚙️ N8N**: Workflow automation, node management
- **📝 Notion**: Documentation, database management
- **🎨 Blender**: 3D modeling, scene creation
- **🎮 Unreal Engine**: Game development, blueprints
- **▲ Vercel**: Web deployment, serverless functions
- **💻 System**: File operations, shell commands

### 🎯 **Smart AI Context**
- **Contextual Tool Suggestions**: AI suggests relevant MCP tools automatically
- **Multi-Provider Support**: OpenAI GPT and Anthropic Claude models
- **Enhanced Responses**: Tool capabilities integrated into AI reasoning

### 🌐 **Modern Web Interface**
- **Real-time Voice Chat**: WebSocket-based communication
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Cyberpunk-inspired UI with glassmorphism
- **Multiple Dashboards**: Main chat, memory viewer, tools explorer

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- OpenAI API Key
- Anthropic API Key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kryptoxotis/spectre-voice-ai.git
   cd spectre-voice-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   # or
   node server.js
   ```

5. **Open your browser**
   - Main Interface: http://localhost:3000
   - Memory Dashboard: http://localhost:3000/memory
   - Tools Explorer: http://localhost:3000/tools

## 📁 Project Structure

```
spectre-voice-ai/
├── server.js              # Main server with WebSocket and API endpoints
├── mcp-integration.js      # MCP tool integration and context system
├── index.html             # Main chat interface
├── memory.html            # Memory visualization dashboard
├── tools.html             # MCP tools explorer
├── memory.json            # Persistent conversation storage
├── package.json           # Dependencies and scripts
└── .env                   # Environment variables (create this)
```

## 🎮 Usage

### Voice Chat
1. Click the microphone button to start recording
2. Speak your message
3. SPECTRE will respond with voice and text
4. All conversations are automatically saved

### Memory System
- Each user gets a unique persistent ID
- Conversations saved across browser sessions
- View memory at `/memory` endpoint
- Export conversation data as JSON

### MCP Tools
- AI automatically suggests relevant tools
- Browse all tools at `/tools` endpoint
- Tools integrated into conversation context
- 40+ tools across development, deployment, AI, and creative platforms

## 🔧 API Endpoints

- `GET /` - Main chat interface
- `GET /memory` - Memory visualization dashboard  
- `GET /tools` - MCP tools explorer
- `GET /api/memory` - JSON memory data
- `GET /api/mcp-tools` - Available MCP tools
- `WebSocket /` - Real-time chat communication

## 🛠 Configuration

### Supported Models
- **OpenAI**: gpt-4o, gpt-4o-mini, gpt-3.5-turbo
- **Anthropic**: claude-sonnet-4, claude-opus-4, claude-haiku-4

### Memory Settings
- Maximum 20 messages per user (auto-cleanup)
- File-based persistence with auto-save
- Real-time memory stats and visualization

### MCP Categories
- **Development**: GitHub, System, Vercel, Railway
- **AI & Media**: ElevenLabs, SPECTRE
- **Automation**: N8N workflow tools
- **Documentation**: Notion integration
- **Creative**: Blender, Unreal Engine
- **Deployment**: Railway, Vercel platforms

## 🎨 UI Features

### Modern Design
- **Cyberpunk Theme**: Blue-green gradient color scheme
- **Glassmorphism**: Translucent cards with backdrop blur
- **Custom Fonts**: Orbitron (headers) + Rajdhani (body)
- **Responsive**: Mobile-friendly interface

### Interactive Elements
- **Real-time Stats**: User count, message count, tool availability
- **Search Functions**: Filter tools and conversations
- **Export Options**: Download conversation data
- **Auto-refresh**: Live updates every 30 seconds

## 🔒 Security

- Environment variable protection for API keys
- No API keys stored in frontend code
- File-based storage with proper error handling
- WebSocket connection security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models and TTS
- **Anthropic** for Claude models  
- **MCP Protocol** for tool integration
- **Node.js** and **Express** for server framework
- **WebSocket** for real-time communication

---

**Built with ❤️ by Kryptoxotis**

🌟 **Star this repo if you find it useful!**