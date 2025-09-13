# 🎫 Smart Ticket System

A comprehensive event ticketing platform with face recognition authentication, built with modern web technologies and AI-powered security features.

![Smart Ticket System](https://img.shields.io/badge/Smart%20Ticket-System-green?style=for-the-badge&logo=ticketmaster)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## 🚀 Features

- **🎟️ Event Management**: Create, manage, and sell tickets for various events
- **🔐 Multi-Authentication**: Email/password, Google OAuth, and Face Recognition
- **💳 Payment Processing**: Secure Stripe integration for ticket purchases
- **📱 Responsive Design**: Modern UI/UX with Tailwind CSS
- **🤖 AI Security**: Anti-spoofing face recognition for secure authentication
- **📊 Admin Dashboard**: Comprehensive analytics and user management
- **🔔 Real-time Notifications**: Instant updates for users
- **📄 PDF Tickets**: Auto-generated tickets with QR codes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │ Face Recognition│
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • TypeScript    │    │ • OpenCV        │
│ • Tailwind CSS  │    │ • Prisma ORM    │    │ • PyTorch       │
│ • Next.js 15    │    │ • PostgreSQL    │    │ • MTCNN         │
│ • Lucide Icons  │    │ • JWT Auth      │    │ • Anti-Spoofing │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │  (PostgreSQL)   │
                    │                 │
                    │ • Users         │
                    │ • Events        │
                    │ • Tickets       │
                    │ • Payments      │
                    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Lucide React](https://img.shields.io/badge/Lucide_React-0.543.0-FF6B6B?style=flat-square&logo=lucide)

### Backend
![NestJS](https://img.shields.io/badge/NestJS-11.0.8-E0234E?style=flat-square&logo=nestjs)
![Node.js](https://img.shields.io/badge/Node.js-20.3.1-339933?style=flat-square&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.15.0-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens)
![Stripe](https://img.shields.io/badge/Stripe-17.7.0-635BFF?style=flat-square&logo=stripe)

### Face Recognition
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)
![OpenCV](https://img.shields.io/badge/OpenCV-4.6.0-5C3EE8?style=flat-square&logo=opencv)
![PyTorch](https://img.shields.io/badge/PyTorch-1.13.1-EE4C2C?style=flat-square&logo=pytorch)
![MTCNN](https://img.shields.io/badge/MTCNN-Face_Detection-FF6B6B?style=flat-square)
![Anti-Spoofing](https://img.shields.io/badge/Anti--Spoofing-Security-FFD700?style=flat-square)

### DevOps & Tools
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=flat-square&logo=swagger)
![ESLint](https://img.shields.io/badge/ESLint-Code_Quality-4B32C3?style=flat-square&logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-Code_Format-F7B93E?style=flat-square&logo=prettier)

## 📁 Project Structure

```
Smart_ticket_System/
├── 📁 frontend/                 # Next.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 app/             # App Router (Next.js 13+)
│   │   │   ├── 📁 auth/        # Authentication pages
│   │   │   ├── 📁 dashboard/   # User dashboard
│   │   │   └── 📁 components/  # Reusable components
│   │   └── 📁 styles/          # CSS styles
│   ├── 📄 package.json
│   └── 📄 next.config.js
│
├── 📁 backend/                  # NestJS Backend API
│   ├── 📁 src/
│   │   ├── 📁 auth/            # Authentication module
│   │   ├── 📁 user/            # User management
│   │   ├── 📁 events/          # Event management
│   │   ├── 📁 ticket/          # Ticket system
│   │   ├── 📁 payment/         # Stripe integration
│   │   ├── 📁 admin/           # Admin panel
│   │   └── 📁 prisma/          # Database service
│   ├── 📁 prisma/              # Database schema & migrations
│   ├── 📄 docker-compose.yml   # PostgreSQL container
│   └── 📄 package.json
│
├── 📁 face-recognition/         # Python Face Recognition System
│   ├── 📁 src/
│   │   ├── 📁 model_lib/       # Neural network models
│   │   ├── 📁 data_io/         # Data processing
│   │   └── 📁 anti_spoof_predict.py
│   ├── 📄 app.py               # Main application
│   ├── 📄 requirements.txt
│   └── 📄 train.py
│
└── 📄 README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Docker** and Docker Compose
- **PostgreSQL** (via Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Smart_ticket_System.git
cd Smart_ticket_System
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env_example .env
# Edit .env with your database and API keys

# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Start the backend server
npm run start:dev
```

**Backend will run on:** `http://localhost:4000`
**API Documentation:** `http://localhost:4000/api`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env_example .env
# Edit .env with your backend URL

# Start the development server
npm run dev
```

**Frontend will run on:** `http://localhost:3000`

### 4. Face Recognition Setup

```bash
cd face-recognition

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download pre-trained models (if needed)
# Place models in resources/ directory

# Run the face recognition system
python app.py
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smart_ticket_db"
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DB=smart_ticket_db

# JWT
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email (Optional)
GMAIL=your_gmail@gmail.com
PASSWORD=your_app_password
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🎯 Key Features Explained

### 🔐 Authentication System
- **Email/Password**: Traditional authentication with bcrypt hashing
- **Google OAuth**: Social login integration
- **Face Recognition**: AI-powered biometric authentication with anti-spoofing

### 💳 Payment Flow
1. User selects event and ticket type
2. Stripe Checkout Session created
3. Payment processed securely
4. Webhook confirms payment
5. Ticket generated with QR code
6. User receives downloadable PDF ticket

### 🤖 Face Recognition Pipeline
1. **Face Detection**: MTCNN for accurate face detection
2. **Feature Extraction**: Deep learning embeddings
3. **Anti-Spoofing**: Prevents photo/video attacks
4. **Matching**: Cosine similarity for user identification
5. **Database Storage**: Secure embedding storage

### 📊 Admin Features
- User management and analytics
- Event creation and management
- Revenue tracking
- System monitoring
- Report generation

## 🧪 API Endpoints

### Authentication
```
POST /auth/register          # User registration
POST /auth/login             # User login
GET  /auth/google            # Google OAuth
GET  /auth/logout            # User logout
POST /auth/forgot-password   # Password reset request
POST /auth/reset-password    # Password reset
```

### Events
```
GET  /events/getall          # Get all events
POST /events/create          # Create event (Admin)
PUT  /events/:id             # Update event (Admin)
DELETE /events/:id           # Delete event (Admin)
```

### Tickets
```
GET  /ticket/my-tickets      # Get user tickets
GET  /ticket/:id/download    # Download ticket PDF
POST /ticket/validate        # Validate ticket
```

### Payments
```
POST /payment/create-checkout-session  # Create Stripe session
POST /payment/webhook                  # Stripe webhook handler
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: User preference support
- **Real-time Updates**: Live notifications
- **Smooth Animations**: Enhanced user experience
- **Accessibility**: WCAG compliant
- **Modern Icons**: Lucide React icon library

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **HTTP-Only Cookies**: XSS protection
- **CORS Configuration**: Cross-origin security
- **Input Validation**: DTO validation with class-validator
- **Rate Limiting**: API abuse prevention
- **Anti-Spoofing**: Face recognition security
- **Password Hashing**: bcrypt encryption

## 📱 Mobile Support

- **Progressive Web App**: Installable on mobile
- **Touch-Friendly**: Optimized for touch interfaces
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Real-time updates

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: NestJS, TypeScript, Prisma
- **Frontend Development**: Next.js, React, Tailwind CSS
- **AI/ML Development**: Python, OpenCV, PyTorch
- **DevOps**: Docker, PostgreSQL, Stripe

## 📞 Support

For support, email support@smartticket.com or join our Slack channel.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework for production
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Stripe](https://stripe.com/) - Payment processing
- [OpenCV](https://opencv.org/) - Computer vision library
- [PyTorch](https://pytorch.org/) - Machine learning framework

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by the Smart Ticket Team

</div>