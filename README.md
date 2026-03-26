# 🚀 Freelance Marketplace

A powerful, full-stack freelance platform designed to connect talented freelancers with clients seeking high-quality work. This project features a modern Next.js frontend and a robust Node.js/Express backend.

---

### 🌐 Live Demo
Check out the deployed application here: [Freelance Marketplace](https://freelance-marketplace-frontend-omega.vercel.app/)

---

## ✨ Features

### 👤 For Both Roles
- **Secure Authentication:** Implementation of JWT-based login and registration with encrypted passwords (bcrypt).
- **Interactive Dashboard:** Personalized workspace for managing jobs and bids efficiently.

### 💼 For Clients
- **Post a Job:** Seamlessly create job listings with detailed descriptions and requirements.
- **Manage Proposals:** View and manage bids submitted by freelancers for your projects.

### 🛠️ For Freelancers
- **Browse Jobs:** Discover new opportunities across various categories.
- **Bid on Projects:** Submit competitive proposals for jobs that match your skills.
- **Project Tracking:** Keep track of your active and past bids.

---

## 💻 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (React, TypeScript, Tailwind CSS)
- **Backend:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & Bcryptjs
- **Deployment:** Vercel (Frontend), Backend (Deployed separately)

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB account (or local MongoDB instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yudigarg3043/Freelance-Marketplace.git
cd Freelance-Marketplace
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory (if needed for API URLs):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Run the frontend development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```text
Freelance-Marketplace/
├── backend/            # Express server, Mongoose models, and API routes
│   ├── models/         # Mongoose schemas (User, Job, Bid)
│   ├── routes/         # API endpoints (Auth, Jobs, Bids, Dashboard)
│   ├── middleware/     # Auth and validation middleware
│   └── server.js       # Main entry point
├── frontend/           # Next.js 14+ application
│   ├── src/app/        # App Router pages and layouts
│   ├── src/components/ # Shared UI components
│   └── public/         # Static assets
└── README.md           # Project documentation
```

---

## 📜 License
This project is licensed under the ISC License.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any suggestions or bug reports.

✨ *Built with passion by the Freelance Marketplace Team.*
