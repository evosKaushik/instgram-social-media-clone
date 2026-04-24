# 📸 Instagram Clone (Full Stack)

A modern **Instagram-like social media app** built with a scalable architecture using **React Native (Expo)** for mobile and **Node.js + Express + MongoDB** for the backend.

This project focuses on **real-time interactions, clean UI/UX, and production-level structure**.

---

## 🚀 Features

### 👤 Authentication

* User signup & login (JWT-based)
* Secure password hashing
* Persistent sessions

### 🏠 Feed System

* Create, edit, delete posts
* Image upload support
* Infinite scrolling feed

### ❤️ Social Interactions

* Like / Unlike posts
* Comment system
* Follow / Unfollow users

### 💬 Real-Time Features

* Live chat (Socket.IO)
* Real-time notifications
* Online/offline user status

### 🌗 UI/UX

* Dark & Light mode support
* Smooth animations
* Mobile-first design (Expo)

---

## 🧠 Tech Stack

### 📱 Frontend (Client)

* React Native (Expo)
* Axios (API calls)
* React Navigation
* Zustand / Redux (state management)

### ⚙️ Backend (Server)

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Socket.IO

---

## 📁 Project Structure

```
project-root/
│
├── client/              # Expo React Native app
│   ├── app/
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── assets/
│
├── server/              # Backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   └── server.js
│
└── README.md
```

---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/instagram-clone.git
cd instagram-clone
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run the server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend (Expo)

```bash
cd client
npm install
npm start
```

Scan QR code using Expo Go app.

---

## 🔗 API Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Flow

* User logs in → receives JWT
* Token stored securely (AsyncStorage / SecureStore)
* Sent via headers:

```
Authorization: Bearer <token>
```

---

## 📡 Real-Time Architecture

* Socket.IO server runs alongside Express
* Users join rooms (chat / notifications)
* Events:

  * `send_message`
  * `receive_message`
  * `user_online`

---

## 🧪 Future Improvements

* 🔥 Story feature (like Instagram Stories)
* 🔥 Reels (short video support)
* 🔥 Push notifications (Firebase)
* 🔥 Image optimization (Cloudinary)
* 🔥 AI-based feed ranking

---

## 🛡️ Security

* Password hashing (bcrypt)
* JWT validation middleware
* Input validation (Joi / Zod)
* Rate limiting (to prevent abuse)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you want to change.

---


## 💡 Author

Developed by **evoskaushik**
Future Full Stack Developer 🚀
