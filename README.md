# 🌍 Travel Story App

A full-stack MERN application where users can share their travel experiences, view stories from others, like/favorite them, and explore different places through real-life travel journals.

---
### Travel Story App Banner

<img width="1915" height="918" alt="image" src="https://github.com/user-attachments/assets/deb19f27-99c5-483d-82c4-6d05c5a29aba" />

---

## ✨ Features

- 📌 Create, edit, and delete travel stories with cover images
- 🗺️ Add visited locations with map coordinates
- 🖼️ Upload multiple images per story (Coming soon)
- ❤️ Like and favorite others' stories
- 🔍 Search & filter stories by location, tags, or date
- 💬 Add comments to travel stories (Coming soon)
- 🔐 JWT-based authentication with Google OAuth
- 👤 Profile page for each user with all their stories
- 📱 Fully responsive UI for all devices

---

## 🚀 Live Demo

🌐 [Visit the Live Site](https://travel-story-app-xxsu.onrender.com/dashboard)

---

## 🧰 Tech Stack

### 🌐 Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- React Router
- Axios

### 🔙 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Google OAuth (Passport.js)

### ☁️ Cloud Services
- Cloudinary (Image Upload)
- MongoDB Atlas
- Render

---

## 📸 Screenshots
| Feature        | Screenshot |
|----------------|------------|
| **Home Page**  | <img width="500" height="918" alt="Home Page" src="https://github.com/user-attachments/assets/deb19f27-99c5-483d-82c4-6d05c5a29aba" /> |
| **Story Card** | <img width="500" height="521" alt="Story Card" src="https://github.com/user-attachments/assets/df840cb2-4983-437d-b210-101b57502c98" /> |
| **Story Detail** | <img width="500" height="928" alt="Story Detail" src="https://github.com/user-attachments/assets/e41e7137-3fa5-4e9d-9b9a-f95bf0274075" /> |

---

## 🛠️ Local Development Setup

### 1. Clone the Repo

```bash
git clone https://github.com/Kashish2402/Travel-Story-App.git
cd Travel-Story-App

```
---

### 2.Backend Setup
```bash
cd backend
npm install

```
---

#### Create a .env file inside backend
```
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=http://localhost:3000

```

### Start the Backend
```
npm start
```

---

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### Create a .env file inside frontend:
```
REACT_APP_BACKEND_URL=http://localhost:5000

```

#### Start the frontend:
```
npm start

```

---

## 📁 Folder Structure

```txt
Travel-Story-App/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
├── README.md
```


---


## 🧩 Future Enhancements

- 🖼️ Multiple images per story with gallery/slider
- 🗺️ Interactive maps with pins for visited places
- 💬 Comment system
- 📈 User dashboard with stats (likes, visits, etc.)
- 📱 PWA support for offline access


---

## 👤 Author

**Kashish Gupta**  
- [GitHub](https://github.com/Kashish2402)  
- [LinkedIn](www.linkedin.com/in/kashish-gupta-32a0431b0)

---

## 📜 License

This project is licensed under the MIT License — feel free to use and adapt it!
