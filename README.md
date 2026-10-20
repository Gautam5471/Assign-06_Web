# PS3: Fee Collection & Receipt Management System

A full-stack MERN application for educational institutes to configure course fee structures, record student payments, track outstanding balances, automatically compute overdue penalties, and generate printable digital receipts.

Built as an individual project based on the class `student_admin_project` architecture with role-based access control (Student and Admin/Accountant), MongoDB Atlas database persistence, Express REST API, and a React (Vite + React Router) frontend.

---

## 📌 Problem Statement Details
- **Assigned Problem Statement**: PS3 — Fee Collection & Receipt Management System
- **Domain**: Education / Finance
- **User Roles**: 
  1. `Accountant / Admin`: Manage course fee structures, record student payments, monitor live collection KPIs, and view defaulters.
  2. `Student`: View enrolled course fee breakdown, payment history, outstanding balance, and print official fee receipts.
- **Linked Collections**:
  1. `User` (Admin & Student roles, Roll Number, Course, Credentials)
  2. `FeeStructure` (Course, Academic Year, Fee Heads breakdown, Total Amount, Due Date, Late Fee Per Day)
  3. `Payment` (Receipt Number, Student Reference, Fee Structure Reference, Amount, Payment Mode, Date, Transaction Reference)
- **Status Workflow**: `Unpaid` ➔ `Partially Paid` ➔ `Paid` (calculated automatically in real-time)
- **Enforced Business Rules**:
  - Rejects zero or negative payment amounts (`400 Bad Request`).
  - Rejects payments exceeding current outstanding dues (`400 Bad Request`).
  - Strict server-side role validation via JWT middleware.
- **Stretch Goals Included**:
  - Automatic daily late fee calculation after due date.
  - Formatted printable receipt voucher with browser print / PDF export stylesheet.

---

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), React Router DOM, Lucide Icons, Vanilla CSS (Glassmorphism & responsive design)
- **Backend**: Node.js, Express.js, CORS, Morgan/Custom Logger, Error Handling Middleware
- **Database**: MongoDB Atlas / Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: https://github.com/Gautam5471/Assign-06_Web
- **Live Deployment URL (Frontend)**: https://assign-06-web.vercel.app
- **Backend Production URL**: https://assign-06-web.onrender.com

---

## 🔑 Test Login Credentials

| Role | Email | Password | Sample Data / Permissions |
| :--- | :--- | :--- | :--- |
| **Accountant / Admin** | `admin@institute.edu` | `adminpassword123` | Full dashboard, fee structure CRUD, payment collection |
| **Student (Paid in Full)** | `aarav.sharma@student.edu` | `studentpassword123` | B.Tech CS (Roll: CS-2026-001) — 100% Paid, view receipt |
| **Student (Partially Paid)** | `ananya.iyer@student.edu` | `studentpassword123` | B.Tech CS (Roll: CS-2026-002) — ₹45,000 paid, ₹43,000 due |
| **Student (Overdue Defaulter)** | `rohan.patel@student.edu` | `studentpassword123` | B.Tech CS (Roll: CS-2026-003) — ₹0 paid, overdue fine added |

*(Quick demo buttons are also provided directly on the `/login` page for one-click access)*

---

## 📂 Project Architecture

```
Assing_06_web/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection with local fallback
│   ├── models/
│   │   ├── User.js               # Student & Admin schema with bcrypt
│   │   ├── FeeStructure.js       # Fee heads & total calculation
│   │   └── Payment.js            # Payment & receipt schema
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Student listing
│   │   ├── feeController.js      # Fee structure CRUD
│   │   └── paymentController.js  # Payment processing & Dashboard analytics
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── feeRoutes.js          # /api/fees endpoints
│   │   └── paymentRoutes.js      # /api/payments endpoints
│   ├── middleware/
│   │   ├── authHandler.js        # JWT verify & allowRoles check
│   │   ├── logger.js             # Request logging middleware
│   │   └── errorHandler.js       # Standardized JSON error response
│   ├── seed.js                   # 10+ records seeder script
│   ├── app.js                    # Server entrypoint
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── _redirects            # Netlify SPA redirect
│   ├── src/
│   │   ├── api/
│   │   │   └── feeApi.js         # Fetch client for all backend endpoints
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Role-based responsive navigation
│   │   │   ├── ProtectedRoute.jsx# Auth & role redirect protection
│   │   │   └── FeeStructureForm.jsx # Shared form for Add/Edit
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Sign in with quick-demo buttons
│   │   │   ├── Register.jsx      # Account creation
│   │   │   ├── AdminDashboard.jsx# Real-time metrics & defaulters
│   │   │   ├── FeeList.jsx       # Course fee cards with search params
│   │   │   ├── AddFeeStructure.jsx
│   │   │   ├── EditFeeStructure.jsx
│   │   │   ├── RecordPayment.jsx # Payment entry with auto-ledger check
│   │   │   ├── StudentFeeLedger.jsx # Individual student dues & receipts
│   │   │   ├── StudentPortal.jsx # Student self-service fee statement
│   │   │   ├── ReceiptView.jsx   # Printable digital receipt voucher
│   │   │   └── NotFound.jsx      # 404 page
│   │   ├── App.jsx               # Client routes
│   │   ├── main.jsx              # BrowserRouter root
│   │   └── index.css             # Glassmorphism design system & print styles
│   ├── vercel.json               # Vercel SPA rewrite rule
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student or admin account
- `POST /api/auth/login` - Sign in and receive JWT token
- `GET /api/auth/me` - Get profile of logged-in user *(Protected)*
- `GET /api/auth/students` - List all registered students *(Admin only)*

### Fee Structures (`/api/fees`)
- `GET /api/fees` - Get all course fee structures *(Protected)*
- `GET /api/fees/:id` - Get fee structure by ID *(Protected)*
- `POST /api/fees` - Create course fee structure with fee heads *(Admin only)*
- `PUT /api/fees/:id` - Update existing course fee structure *(Admin only)*
- `DELETE /api/fees/:id` - Remove fee structure *(Admin only)*

### Payments & Receipts (`/api/payments`)
- `POST /api/payments` - Record fee payment, validate dues, issue receipt *(Admin only)*
- `GET /api/payments/dashboard` - Get total collected, pending dues, mode split, and defaulters *(Admin only)*
- `GET /api/payments/student/:id` - Get detailed ledger statement for a student *(Protected)*
- `GET /api/payments/my-fees` - Get logged-in student fee summary and receipts *(Student)*
- `GET /api/payments/receipts/:receiptNo` - Retrieve official receipt voucher *(Protected)*

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18 or newer)
- MongoDB instance (MongoDB Atlas connection string or local MongoDB on `27017`)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and PORT (default is 5001)

# Seed initial database with sample courses, students and payments:
node seed.js

# Start backend server:
node app.js
```
Backend will run at: `http://localhost:5001`

### 2. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Ensure VITE_API_URL=http://localhost:5001/api

# Run Vite development server:
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## 🎥 YouTube Video Submission Guidelines Checklist
- [x] Full demonstration covering Problem Statement PS3
- [x] Admin flow: Dashboard, Fee Structures CRUD, Record Payment, Overdue Defaulters
- [x] Student flow: Fee statement, Dues breakdown, Receipt view & print
- [x] Business rules: Zero payment rejection, Overpayment rejection
- [x] Architecture explanation: Node.js, Express, MongoDB Atlas, React Router
# Assign-06_Web
