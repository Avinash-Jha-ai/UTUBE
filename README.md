# 🎬 Utube (MERN Stack)
A premium full-stack video-sharing platform built using the MERN stack, featuring a cinematic user interface, robust video management, and a high-performance backend architecture.

💡 **Development Note**: The backend architecture and video streaming logic were custom-engineered from scratch, while the frontend user interface and cinematic animations were developed with significant AI assistance to achieve a state-of-the-art premium aesthetic.

🔗 **Live Demo**: [https://utube-frontend.vercel.app/](https://utube-frontend.vercel.app/)

💻 **GitHub Repo**: [https://github.com/Avinash-Jha-ai/UTUBE](https://github.com/Avinash-Jha-ai/UTUBE)

## 🚀 Features
- 🔐 **Secure Authentication**: JWT-based login .
- 📹 **Advanced Video Management**: Seamless uploads and processing powered by ImageKit.
- 🎭 **Cinematic Experience**: Smooth transitions and fluid animations using Framer Motion.
- 👥 **Social Interaction**: Real-time likes, dislikes, and channel subscription system.
- 📚 **User Library**: Personalized history, liked videos, and watch later collections.
- 🔍 **Smart Discovery**: Regex-based search system with voice command support.
- 📱 **Fully Responsive**: Optimized for a flawless experience across all device sizes.

## 🛠️ Tech Stack
### Frontend
- **React.js (Vite)**
- **Redux Toolkit** (State Management)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **React Router 7** (Navigation)
- **Axios** (API Requests)

### Backend
- **Node.js**
- **Express.js** (REST API)
- **JWT** (Authentication)
- **Multer** (File Handling)

### Database
- **MongoDB (Mongoose ODM)**

### Other Tools
- **ImageKit** (Media storage & optimization)
- **Morgan** (Logging)
- **Bcryptjs** (Encryption)
- **Git & GitHub**

## 📂 Project Structure
```text
UTUBE/
│
├── backend/
│   ├── src/
│   │   ├── configs/        # Database & Service configurations
│   │   ├── controllers/    # Business logic (Auth, Video, User, Social)
│   │   ├── middlewares/    # Authentication & file validation
│   │   ├── models/         # MongoDB schemas (Mongoose)
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # ImageKit & external integrations
│   │   └── app.js          # Express app setup
│   └── server.js           # Entry point (Port 3000)
│
└── frontend/
    ├── src/
    │   ├── assets/         # Images & static files
    │   ├── features/       # Feature-based logic (Videos, Auth, Library)
    │   ├── store/          # Redux Toolkit global store
    │   ├── App.jsx         # Main application component
    │   └── main.jsx        # Frontend entry point
```

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Avinash-Jha-ai/UTUBE.git
cd UTUBE
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

### 4. Run the project
```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

## 📚 What I Learned
- Implementing a complex **Cinematic UI** using Framer Motion and modern CSS techniques.
- Managing **large file uploads** and media optimization with ImageKit and Multer.
- Orchestrating **OAuth 2.0** alongside traditional JWT authentication flows.
- Handling complex global states with **Redux Toolkit** for social interactions like subscriptions and libraries.
- Designing a scalable **RESTful API** architecture for high-traffic video content.

## 🔮 Future Improvements
- 💬 **Real-time Comments**: Live commenting and nested reply system.
- 🔔 **Push Notifications**: Alerts for new uploads and engagement.
- 🎞️ **Shorts Platform**: Dedicated section for short-form vertical video content.
- ⚡ **PWA Support**: Offline viewing and app-like experience.

## 🤝 Contributing
Contributions are welcome! Feel free to fork this repo and submit a pull request.

## 📬 Contact
**GitHub**: [https://github.com/Avinash-Jha-ai](https://github.com/Avinash-Jha-ai)  
**LinkedIn**: [https://www.linkedin.com/in/avinash-jha-0a261b385/](https://www.linkedin.com/in/avinash-jha-0a261b385/)

⭐ If you like this project, don’t forget to give it a star!
