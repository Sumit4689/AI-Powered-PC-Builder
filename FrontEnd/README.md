# AI-Powered PC Builder

A comprehensive web application that uses artificial intelligence to recommend custom PC builds based on user requirements, budget, and use cases.

## 🚀 Features

- **AI-Powered Recommendations**: Get personalized PC build suggestions using Google Gemini AI
- **Budget-Based Filtering**: Find builds that fit your exact budget requirements
- **Use Case Optimization**: Specialized builds for gaming, video editing, programming, and more
- **Component Compatibility**: Automatic compatibility checking between components
- **User Authentication**: Secure user accounts with JWT authentication
- **Save & Export Builds**: Save favorite builds and export them as PDF quotations
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **YouTube Integration**: Get component review videos for informed decisions

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **jsPDF** - PDF generation for build exports

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Google Gemini AI** - AI-powered build recommendations

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/AI-Powered-PC-Builder.git
cd AI-Powered-PC-Builder
```

### 2. Backend Setup
```bash
cd BackEnd
npm install

# Create a .env file in the BackEnd directory
cp .env.example .env

# Add your environment variables to .env:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# GEMINI_API_KEY=your_google_gemini_api_key
# PORT=11822
```

### 3. Frontend Setup
```bash
cd ../FrontEnd
npm install
```

### 4. Start the application
```bash
# Start the backend server (from BackEnd directory)
npm start

# Start the frontend development server (from FrontEnd directory)
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:11822`

## 🔧 Environment Variables

Create a `.env` file in the BackEnd directory with the following variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_secure_jwt_secret

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# Server
PORT=11822
NODE_ENV=development
```

## 📁 Project Structure

```
AI-Powered-PC-Builder/
├── BackEnd/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── buildController.js
│   │   └── generateBuild.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── buildModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── buildRouter.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── FrontEnd/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BuildResult.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SavedBuilds.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎯 How It Works

1. **Set Requirements**: Users input their budget, use case, and component preferences
2. **AI Analysis**: Google Gemini AI analyzes requirements and market data
3. **Get Recommendations**: AI generates optimized build recommendations
4. **Save & Export**: Users can save builds to their account or export as PDF

## 👥 Team

This project was developed as a Semester 2 Mini Project by:

- **Sumit Patil** - Full Stack Developer (Roll No: 2024)
- **[Friend 1 Name]** - Backend Developer (Roll No: [Number])
- **[Friend 2 Name]** - Frontend Developer (Roll No: [Number])

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent build recommendations
- Component manufacturers for specifications data
- Open source community for various libraries and tools

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ by Team AI-PC-Builder**

