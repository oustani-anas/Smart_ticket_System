# Smart Ticket System - Authentication Pages

A modern authentication system built with Next.js 14, Shadcn/UI, and NextAuth.js for the Smart Ticket System.

## 🎨 Features

- **Modern Design**: Clean, professional UI with green theme (#22c55e)
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Form Validation**: React Hook Form with Zod validation
- **Google OAuth**: NextAuth.js integration (ready for setup)
- **Accessibility**: Proper labels, focus states, and keyboard navigation
- **TypeScript**: Full type safety throughout the application

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env.local
```

3. Configure your environment variables in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── register/page.tsx    # Registration page
│   ├── api/auth/[...nextauth]/  # NextAuth.js API routes
│   └── page.tsx                 # Home page (redirects to login)
├── components/
│   ├── auth/
│   │   └── auth-layout.tsx      # Shared authentication layout
│   └── ui/                      # Shadcn/UI components
└── lib/
    └── utils.ts                 # Utility functions
```

## 🎯 Pages

### Login Page (`/auth/login`)
- Email and password fields with validation
- "Forgot password" link (placeholder)
- Google OAuth button
- Link to registration page
- Form validation with error messages

### Register Page (`/auth/register`)
- First name, last name, email fields
- Password with strength validation
- Confirm password field
- Terms and privacy policy links
- Google OAuth button
- Link to login page

## 🔧 Technologies Used

- **Next.js 14**: App Router, Server Components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: High-quality UI components
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **NextAuth.js**: Authentication (Google OAuth ready)
- **Lucide React**: Beautiful icons

## 🎨 Design System

### Colors
- **Primary Green**: #22c55e (oklch(0.565 0.151 142.5))
- **Background**: White with green gradient accents
- **Text**: Gray scale for hierarchy
- **Borders**: Light gray with green focus states

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Clean, readable text
- **Labels**: Medium weight for form fields

### Components
- **Cards**: Rounded corners, soft shadows
- **Buttons**: Green primary, hover effects
- **Inputs**: Icons, focus states, validation styling
- **Layout**: Centered, responsive design

## 🔗 Backend Integration

The authentication pages are ready to integrate with your NestJS backend. Key integration points:

1. **Login Form**: Update `onSubmit` in `/auth/login/page.tsx`
2. **Register Form**: Update `onSubmit` in `/auth/register/page.tsx`
3. **API Endpoints**: Configure your backend URLs in environment variables
4. **NextAuth**: Configure additional providers and callbacks as needed

## 🚀 Next Steps

1. **Google OAuth Setup**: 
   - Create Google Cloud Console project
   - Configure OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Backend Integration**:
   - Connect forms to your NestJS API
   - Handle authentication responses
   - Implement session management

3. **Additional Features**:
   - Forgot password functionality
   - Email verification
   - Social login providers
   - Remember me functionality

## 📝 License

This project is part of the Smart Ticket System.