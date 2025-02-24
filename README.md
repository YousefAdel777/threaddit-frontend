# Threaddit Frontend

Threaddit is a Reddit-like platform that allows users to create communities, post content, and engage in discussions. This repository contains the frontend for Threaddit, built using **Next.js**.

## 🚀 Features
- **User Authentication**: Sign up, login, logout, and JWT authentication.
- **Communities**: Users can create and manage communities.
- **Posts & Comments**: Create, read, update, and delete posts and comments.
- **Voting System**: Upvote/downvote for posts and comments.
- **Moderation**: Role-based permissions for moderators.
- **Optimistic UI Updates**: Real-time feedback using SWR

## 🛠️ Tech Stack
- **Framework**: Next.js
- **State Management**: Zustand + SWR
- **UI Library**: Tailwind CSS & shadcn/ui
- **API Client**: Fetch API & SWR
- **Authentication**: JWT with Djoser

## 🔧 Installation & Setup
### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/threaddit-frontend.git
cd threaddit-frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables
Create a `.env.local` file and add:
```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/ws/
```

### 4️⃣ Run the development server
```bash
npm run dev
```

### 5️⃣ Build for production
```bash
npm run build
npm start
```