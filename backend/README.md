# ⚙️ Freelance Marketplace - Backend

This is the backend server for the Freelance Marketplace project, built with [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/).

---

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Create a `.env` file in this directory and add your MongoDB connection string and JWT secret:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Then, run the development server:

```bash
npm run dev
```

The server will be running on [http://localhost:5000](http://localhost:5000).

---

## 🛠️ Features

- **Auth System:** JWT-based user authentication (Signup/Login).
- **REST API:** Endpoints for managing jobs, bids, and user dashboards.
- **Database:** MongoDB with Mongoose for schema-based data modeling.
- **Security:** Password hashing with Bcryptjs.

---

## 📂 Folder Structure

- `models/`: Mongoose schemas for User, Job, and Bid.
- `routes/`: Express routers for handling various API resources.
- `middleware/`: Custom middleware for auth verification.
- `server.js`: Server initialization and configuration.

---

## 🔗 Project Link

For the full project details and frontend setup, please refer to the [Main README.md](../README.md).

✨ *Building the backbone of a better freelance ecosystem.*
