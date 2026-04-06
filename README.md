# 🔐 Password Reset Backend (MERN)

This is a backend API built using **Node.js, Express, MongoDB** that provides complete authentication functionality including:

- User Registration  
- User Login (JWT Authentication)  
- Forgot Password (Email Reset Link using Brevo API)  
- Reset Password using secure token  

---

## 🚀 Live API URL

https://server-pjub.onrender.com

---

## 📦 Tech Stack

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT (Authentication)  
- bcryptjs (Password Hashing)  
- Crypto (Token generation)  
- Brevo (Email API service)  
- CORS  

---

## 📁 Project Structure

```
backend/
│── config/
│   ├── db.js
│
│── controllers/
│   ├── authController.js
│
│── models/
│   ├── User.js
│
│── routes/
│   ├── authRoutes.js
│
│── server.js
│── .env
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone "https://github.com/MahaProject-Git30/server"
cd backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create `.env` file

```env
PORT=3001
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
---

### 4. Run the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3001
```

---

## 🔗 API Endpoints

### ✅ Register

```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Maha",
  "email": "test@gmail.com",
  "mobile": "1234567890",
  "password": "123456"
}
```

---

### ✅ Login

```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

---

### ✅ Forgot Password

```
POST /api/auth/forgot
```

**Body:**
```json
{
  "email": "test@gmail.com"
}
```

📩 Sends password reset link to email  

---

### ✅ Reset Password

```
POST /api/auth/reset/:token
```

**Body:**
```json
{
  "password": "newpassword"
}
```

---

## 🔁 Password Reset Flow

1. User enters email  
2. Server generates reset token  
3. Email sent via Brevo API  
4. User clicks reset link  
5. New password submitted  
6. Password updated in database  

---

## 🔐 Security Features

- Password hashed using bcrypt  
- JWT authentication  
- Reset token expiry (10 minutes)  
- Secure email-based reset  
- User existence not revealed  

---

## 🌐 Deployment

- **Backend:** Render  
- **Frontend:** Netlify  
  
---

## 👨‍💻 Author

**Mahalakshmi R**

---

## ⭐ Future Improvements

- OTP-based password reset  
- Email templates  
- Rate limiting  
- Refresh token authentication  