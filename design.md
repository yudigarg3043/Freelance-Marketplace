# Design Document - Freelance Marketplace

## 1. System Architecture
The application follows a modern Client-Server architecture:
- **Frontend (Client):** A Next.js application that handles the UI, routing, and state management. It communicates with the backend via RESTful API calls.
- **Backend (Server):** A Node.js/Express server that handles business logic, authentication, and database interactions.
- **Database:** MongoDB is used for persistent data storage, managed through the Mongoose ODM.

## 2. Database Design (Schema)

### 2.1 User Model
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Hashed)
- `role`: Enum ('client', 'freelancer')
- `title`: String
- `phone`: String
- `location`: String
- `bio`: String
- `skills`: Array of Strings
- `timestamps`: CreatedAt, UpdatedAt

### 2.2 Job Model
- `title`: String (Required)
- `description`: String (Required)
- `budget`: Number (Required)
- `deadline`: Date (Bidding deadline)
- `completionDeadline`: Date
- `category`: Enum (Web Development, Design, etc.)
- `client`: ObjectId (Ref: User)
- `bids`: Array of ObjectIds (Ref: Bid)
- `status`: Enum ('open', 'in-progress', 'completed')
- `acceptedBid`: ObjectId (Ref: Bid)

### 2.3 Bid Model
- `job`: ObjectId (Ref: Job)
- `freelancer`: ObjectId (Ref: User)
- `amount`: Number
- `message`: String
- `status`: Enum ('pending', 'accepted', 'rejected')

## 3. API Design

### 3.1 Authentication (`/api/auth`)
- `POST /register`: Create a new user account.
- `POST /login`: Authenticate user and return a JWT.

### 3.2 Jobs (`/api/jobs`)
- `GET /`: List all open jobs.
- `POST /`: Create a new job (Client only).
- `GET /:id`: Get detailed information about a specific job.

### 3.3 Bids (`/api/bids`)
- `POST /`: Submit a bid (Freelancer only).
- `PUT /:id/status`: Update bid status (Accept/Reject - Client only).

### 3.4 Dashboard (`/api/dashboard`)
- `GET /client`: Fetch client-specific stats and jobs.
- `GET /freelancer`: Fetch freelancer-specific stats and applied jobs.

## 4. UI/UX Design Principles
- **Clean Layout:** Minimalist design focusing on content and calls to action.
- **Responsive Navigation:** Sidebar/Topnav that adapts to screen size.
- **Feedback Loops:** Visual indicators for loading states, success messages, and errors.
- **Consistent Theming:** Unified color palette and typography using Tailwind CSS.

## 5. Security Architecture
- **JWT Authentication:** Secure communication between frontend and backend using bearer tokens.
- **Password Hashing:** Utilizing `bcryptjs` for secure password storage.
- **Middleware Protection:** Routes are protected by a verification middleware that checks for valid JWTs and user roles.
- **CORS Configuration:** Restricting API access to trusted origins.
