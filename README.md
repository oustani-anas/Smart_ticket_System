# 🎫 Smart Ticket System

**Internship Project - Backend Development**

A full-stack event ticketing platform with face recognition authentication, developed during my backend development internship. This project demonstrates modern API development, database design, payment integration, and AI-powered security features.

![Smart Ticket System](https://img.shields.io/badge/Internship-Project-blue?style=for-the-badge&logo=graduation-cap)
![Backend Dev](https://img.shields.io/badge/Backend-Developer-green?style=for-the-badge&logo=code)
![Version](https://img.shields.io/badge/version-1.0.0-orange?style=for-the-badge)

## 🚀 Key Features

- **🔐 Multi-Authentication**: JWT, Google OAuth, Face Recognition
- **💳 Payment Integration**: Stripe API with webhook handling
- **🎟️ Event & Ticket Management**: Full CRUD operations
- **📊 Admin Dashboard**: User management and analytics
- **🤖 AI Security**: Anti-spoofing face recognition
- **📄 PDF Generation**: QR code tickets with PDF-lib

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │ Face Recognition│
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • TypeScript    │    │ • OpenCV        │
│ • Tailwind CSS  │    │ • Prisma ORM    │    │ • PyTorch       │
│ • Next.js 15    │    │ • PostgreSQL    │    │ • MTCNN         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │  (PostgreSQL)   │
                    │ • Users/Events  │
                    │ • Tickets/Payments│
                    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend (Primary Focus)
![NestJS](https://img.shields.io/badge/NestJS-11.0.8-E0234E?style=flat-square&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.15.0-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens)
![Stripe](https://img.shields.io/badge/Stripe-17.7.0-635BFF?style=flat-square&logo=stripe)

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

### AI/ML
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)
![OpenCV](https://img.shields.io/badge/OpenCV-4.6.0-5C3EE8?style=flat-square&logo=opencv)
![PyTorch](https://img.shields.io/badge/PyTorch-1.13.1-EE4C2C?style=flat-square&logo=pytorch)

## 📁 Project Structure

```
Smart_ticket_System/
├── 📁 backend/                  # NestJS Backend API (Main Focus)
│   ├── 📁 src/
│   │   ├── 📁 auth/            # JWT & OAuth authentication
│   │   ├── 📁 user/            # User management & profiles
│   │   ├── 📁 events/          # Event CRUD operations
│   │   ├── 📁 ticket/          # Ticket generation & validation
│   │   ├── 📁 payment/         # Stripe integration & webhooks
│   │   └── 📁 prisma/          # Database service & ORM
│   ├── 📁 prisma/              # Database schema & migrations
│   └── 📄 docker-compose.yml   # PostgreSQL container
│
├── 📁 frontend/                 # Next.js Frontend
│   ├── 📁 src/app/             # App Router pages
│   └── 📁 src/components/      # Reusable components
│
├── 📁 face-recognition/         # Python AI System
│   ├── 📁 src/                 # ML models & processing
│   └── 📄 app.py               # Face recognition app
│
└── 📄 README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **PostgreSQL** (via Docker)

### Backend Setup (Main Focus)
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env_example .env

# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Start the backend server
npm run start:dev
```

**Backend runs on:** `http://localhost:4000`  
**API Documentation:** `http://localhost:4000/api`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/smart_ticket_db"
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## 🎯 Backend Development Highlights

### 🔐 Authentication & Security
- **JWT Implementation**: Secure token-based authentication
- **Google OAuth**: Passport.js integration for social login
- **Password Security**: bcrypt hashing with salt rounds
- **CORS Configuration**: Secure cross-origin requests

### 💳 Payment Integration
- **Stripe API**: Complete payment processing workflow
- **Webhook Handling**: Secure payment confirmation
- **Session Management**: Checkout session creation and validation

### 🗄️ Database Design
- **Prisma ORM**: Type-safe database operations
- **PostgreSQL**: Relational database with proper relationships
- **Migrations**: Version-controlled schema changes
- **Data Validation**: DTO validation with class-validator

### 📊 API Development
- **RESTful Design**: Clean API endpoints
- **Swagger Documentation**: Auto-generated API docs
- **Error Handling**: Comprehensive error responses
- **Middleware**: Request logging and validation

## 🧪 Key API Endpoints

### Authentication
```
POST /auth/register          # User registration
POST /auth/login             # User login
GET  /auth/google            # Google OAuth
POST /auth/forgot-password   # Password reset
```

### Core Features
```
GET  /events/getall          # Get all events
GET  /ticket/my-tickets      # Get user tickets
GET  /ticket/:id/download    # Download ticket PDF
POST /payment/create-checkout-session  # Stripe payment
POST /payment/webhook        # Payment confirmation
```

## 🚀 Deployment

```bash
# Backend Production
cd backend
npm run build
npm run start:prod

# Frontend Production
cd frontend
npm run build
npm run start
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Stripe](https://stripe.com/) - Payment processing
- [OpenCV](https://opencv.org/) - Computer vision library

---

<div align="center">

**🎓 Internship Project - Backend Development**

*Demonstrating modern API development, database design, and payment integration*

</div>