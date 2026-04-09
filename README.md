# GlamUp – AI Skin Analysis & Skincare Assistant

## Overview

GlamUp is a web application that helps users understand their skin better using AI-based analysis and a conversational assistant. Users can upload a photo of their face, and the system identifies common skin concerns such as acne, dark spots, and dark circles. Based on this analysis, the app provides personalized skincare suggestions.

The goal of this project is to make basic skincare guidance more accessible and easy to understand, especially for users who may not have immediate access to dermatological advice.

---

## Features

### Skin Analysis

* Upload an image to analyze facial skin
* Detect common issues like acne, pigmentation, and dark circles

### Chat-Based Assistance

* Interactive chat to understand user concerns
* Helps determine skin type (oily, dry, combination)
* Provides simple and relevant skincare advice

### Personalized Recommendations

* Suggests routines based on detected skin issues
* Offers preventive care tips

### Authentication

* User registration and login
* Secure access using JWT authentication

### User Data (Optional Extension)

* Save previous analyses
* Track changes over time

---

## Tech Stack

### Frontend

* React.js (Vite)
* CSS / Tailwind
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB with Mongoose

### Tools

* JWT for authentication
* Multer / Cloudinary for image uploads
* Postman / Bruno for API testing

---

## Project Structure

```
glamup/
│
├── client/              Frontend (React)
│   ├── src/
│   ├── components/
│   └── pages/
│
├── server/              Backend (Node + Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
│
├── .env
├── package.json
└── README.md
```

---

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/glamup.git
cd glamup
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Sample API Endpoints

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | /api/auth/register | Register a new user       |
| POST   | /api/auth/login    | Login user                |
| POST   | /api/analyze       | Upload image for analysis |
| GET    | /api/user/profile  | Get user profile          |

---

## Future Improvements

* Improve accuracy of AI-based skin detection
* Add a dashboard to track skin progress
* Enhance mobile responsiveness
* Integrate product recommendations
* Deploy with a complete CI/CD pipeline

---

## Deployment

* Frontend: Vercel or Netlify
* Backend: Render or Railway
* Database: MongoDB Atlas

---

## Contributing

Contributions are welcome. You can fork the repository and submit a pull request with improvements or new features.

---

## Contact

GitHub: https://github.com/varsha479

Email: (varshaarulkannan@gmail.com)

---

## Final Note

This project is built to demonstrate full-stack development skills along with practical use of AI concepts. It focuses on solving a real-world problem in a simple and approachable way.
