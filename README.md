# Ollama Chat Interface

A web-based chat interface for interacting with Ollama language models, featuring a clean UI and configurable settings.

## Features

- 💬 Real-time chat interface with Ollama models
- ⚙️ Configurable Ollama API endpoint and model selection
- 🔄 WebSocket-based communication for instant responses
- 📱 Responsive design that works on desktop and mobile
- ⏳ Loading states and error handling
- 🎨 Clean, modern UI with dark mode support

## Prerequisites

- Node.js 20 or higher
- [Ollama](https://ollama.ai/) running locally or accessible via network

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ollama-chat-interface
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Configuration

The application can be configured through the settings dialog (gear icon):

- **Ollama URL**: The URL where your Ollama instance is running (default: `http://localhost:11434`)
- **Model**: The Ollama model to use (default: `llama2`)

Make sure your Ollama instance is running and accessible at the configured URL.

## Usage

1. Open the application in your browser
2. (Optional) Configure the Ollama URL and model in settings
3. Type your message in the input field
4. Press Enter or click the send button to chat with the AI
5. View responses in real-time in the chat interface

## Development

### Project Structure

- `/client` - React frontend application
- `/server` - Express backend server
- `/shared` - Shared types and schemas
- `/components` - Reusable React components

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run check` - Type-check the project

### Tech Stack

- Frontend:
  - React
  - TypeScript
  - TanStack Query
  - shadcn/ui
  - Tailwind CSS
  - WebSocket client

- Backend:
  - Express
  - WebSocket server
  - In-memory storage

## License

MIT
