# ⚙️ Freelance Marketplace - Backend

This is the backend server for the Freelance Marketplace project, built with [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/). It handles authentication, job management, and secure file processing.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in this directory and add the following keys:

```env
PORT=4080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_URL=your_cloudinary_url
```

### 3. Run the Server
```bash
npm start
```
The server will be running on [http://localhost:4080](http://localhost:4080).

---

## 🛠️ Features

- **Dual Auth System:** Supports both standard JWT-based email/password and **Google OAuth 2.0** (via Passport.js).
- **Secure File Processing:** Integrated with **Cloudinary** for hosting freelancer resumes and project attachments.
- **Fail-Safe CORS:** Custom middleware ensures API stability across different deployment origins.
- **RESTful API:** Modular endpoints for managing jobs, bids, reviews, and role-specific dashboards.
- **Data Integrity:** MongoDB with Mongoose for robust, schema-based modeling.

---

## 📂 Folder Structure

- `config/`: Configuration for Passport.js strategies and database connection.
- `models/`: Mongoose schemas for User, Job, Bid, and Review.
- `routes/`: Modular Express routers handling various API resources.
- `middleware/`: Custom middleware for auth verification, file uploads (Multer), and CORS enforcement.
- `server.js`: Central entry point and middleware orchestration.

---

## 🔗 Project Link

For the full project details, frontend setup, and comprehensive documentation, please refer to the **[Main README.md](../README.md)**.

✨ *Building the backbone of a better freelance ecosystem.*

