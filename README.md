# 🚀 Freelance Marketplace

A powerful, full-stack freelance platform designed to connect talented freelancers with clients seeking high-quality work. This project features a modern Next.js frontend and a robust Node.js/Express backend, integrated with Google OAuth and Cloudinary storage.

---

### 🌐 Live Demo
Check out the deployed application here: [Freelance Marketplace](https://freelance-marketplace-frontend-omega.vercel.app/)

---

## 📝 Project Description
The Freelance Marketplace is a comprehensive platform that facilitates professional collaboration. It allows clients to post detailed job requirements with attachments and freelancers to bid on projects with customized proposals and delivery timelines. The system ensures a smooth flow from job discovery to project completion with role-based dashboards and a verified professional resume system.

## 🎯 Key Features & Improvements
- **Google OAuth 2.0:** Secure, one-click login and registration for both Clients and Freelancers.
- **Resume Hub:** Freelancers can upload professional PDF resumes (up to 5MB) powered by **Cloudinary**.
- **Advanced Bidding:** Proposals now include customized delivery timeframes and support for project attachments.
- **Dynamic Profile Navigation:** Clients can instantly view a freelancer's full professional profile directly from their bid proposals.
- **Fail-Safe CORS Architecture:** Robust backend configuration ensuring stability across multiple deployment environments (Vercel, Local).

## 💻 Tech Stack

- **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router, Tailwind CSS, Framer Motion)
- **Backend:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & [Passport.js](http://www.passportjs.org/) (Google OAuth)
- **Storage:** [Cloudinary](https://cloudinary.com/) (for Resumes and Job Attachments)
- **Deployment:** [Vercel](https://vercel.com/) (Frontend & Backend)

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account
- Cloudinary Account
- Google Cloud Console Project (for OAuth keys)

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
Create a `.env` file in the `backend` directory:
```env
PORT=4080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_URL=your_cloudinary_url
```
Run the backend: `npm start`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:4080
```
Run the frontend: `npm run dev`

---

## 📂 Project Structure

```text
Freelance-Marketplace/
├── backend/            # Express server, Mongoose models, and API routes
│   ├── config/         # Passport and DB configurations
│   ├── models/         # Mongoose schemas (User, Job, Bid, Review)
│   ├── routes/         # API endpoints (Auth, Jobs, Bids, Dashboard, Reviews)
│   ├── middleware/     # Auth, Upload, and CORS middleware
│   └── server.js       # Main entry point
├── frontend/           # Next.js application
│   ├── src/app/        # App Router pages and layouts
│   ├── src/components/ # UI, Layout, and Feature components
│   └── public/         # Static assets
├── requirement_and_design_document.md  # Comprehensive technical and functional specs
└── README.md           # Project entry point
```

---

## 📜 Documentation
For a deep dive into the system architecture, API endpoints, and database schemas, please refer to the **[Requirement & Design Document](./requirement_and_design_document.md)**.

---

## 📜 License
This project is licensed under the ISC License.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

✨ *Built with passion by the Freelance Marketplace Team.*
 submit a Pull Request or open an issue for any suggestions or bug reports.

✨ *Built with passion by the Freelance Marketplace Team.*

