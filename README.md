# Theatre Management Backend

A TypeScript-based backend API for managing theatre operations, built with Express.js.

## 🚀 Features

- **TypeScript**: Fully typed backend with TypeScript 5.9+
- **Express.js**: Fast, minimalist web framework
- **Security**: Helmet.js for security headers
- **CORS**: Cross-Origin Resource Sharing enabled
- **Logging**: Morgan for HTTP request logging
- **Hot Reload**: Development server with auto-restart

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (recommended package manager)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/MinhTuan120704/Theatre-Management-BE.git
cd Theatre-Management-BE
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```env
PORT=3000
NODE_ENV=development
```

## 🏃 Running the Application

### Development Mode

```bash
pnpm dev
```

The server will start on `http://localhost:3000` with hot-reload enabled.

### Production Build

```bash
# Build the TypeScript code
pnpm build

# Start the production server
pnpm start
```

## 📁 Project Structure

```
Theatre-Management-BE/
├── src/
│   ├── app.ts          # Express application setup
│   └── server.ts       # Server entry point
├── dist/               # Compiled JavaScript (generated)
├── .env               # Environment variables (create from .env.example)
├── .gitignore         # Git ignore rules
├── package.json       # Project dependencies
├── pnpm-lock.yaml     # pnpm lock file
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🔧 Available Scripts

| Script       | Description                              |
| ------------ | ---------------------------------------- |
| `pnpm dev`   | Start development server with hot-reload |
| `pnpm build` | Compile TypeScript to JavaScript         |
| `pnpm start` | Run production server                    |

## 🧰 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js v5
- **Security**: Helmet.js
- **CORS**: cors
- **Logging**: Morgan
- **Dev Tools**: ts-node-dev, nodemon

## 📝 API Endpoints

### Health Check

```
GET /
```

Returns a status message confirming the server is running.

**Response:**

```
Theatre Management Backend is running.
```

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configured for cross-origin requests
- **Input Validation**: JSON and URL-encoded body parsing

## 🌍 Environment Variables

| Variable   | Description        | Default       |
| ---------- | ------------------ | ------------- |
| `PORT`     | Server port number | `3000`        |
| `NODE_ENV` | Environment mode   | `development` |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **MinhTuan120704** - [GitHub Profile](https://github.com/MinhTuan120704)

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using TypeScript and Express.js
