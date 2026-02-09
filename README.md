# ResumeAI Frontend

A modern, responsive frontend application for AI-powered resume analysis. Built with React, TypeScript, and Tailwind CSS, featuring a clean UI/UX with authentication, resume analysis, and history tracking.

## Features

- **User Authentication** - Secure login and registration with JWT
- **Resume Analysis** - Analyze resumes via text input or PDF upload
- **Job-Targeted Analysis** - Get tailored feedback based on job descriptions
- **Analysis History** - View past analyses with expandable results
- **Responsive Design** - Fully responsive with mobile navigation
- **Performance Optimized** - Code splitting, lazy loading, and optimized rendering
- **Modern UI/UX** - Clean, minimal design with smooth animations

## Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 3.4.15
- **State Management**: Redux Toolkit 2.11.2
- **Routing**: React Router DOM 7.13.0
- **Forms**: React Hook Form 7.71.1 + Zod 4.3.6
- **HTTP Client**: Axios 1.13.5
- **Icons**: Lucide React 0.563.0

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # App-level configuration
│   │   ├── api/                # API client configuration
│   │   ├── components/         # Shared UI components
│   │   ├── layouts/            # Layout components
│   │   ├── pages/              # App-level pages (404, etc.)
│   │   ├── router/             # Route configuration & guards
│   │   ├── store/              # Redux store & slices
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Constants & utilities
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Authentication feature
│   │   │   ├── components/    # Auth components
│   │   │   ├── hooks/         # Auth hooks
│   │   │   ├── pages/          # Login/Register pages
│   │   │   └── schemas/        # Validation schemas
│   │   └── resume/             # Resume analysis feature
│   │       ├── components/     # Resume components
│   │       ├── hooks/          # Resume hooks
│   │       ├── pages/          # Dashboard/History pages
│   │       └── schemas/        # Validation schemas
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, defaults provided):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start Vite development server (port 5173)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Key Features Implementation

### Authentication
- Protected routes using route guards
- Public routes (login/register) redirect authenticated users
- JWT token stored in localStorage
- Automatic token validation and user state management

### Resume Analysis
- Two input modes:
  - **Text Mode**: Paste resume text directly
  - **File Mode**: Upload PDF file (max 5MB)
- Optional job description for targeted feedback
- Real-time form validation with Zod
- Loading states and error handling

### History Management
- Paginated history with "Load More" functionality
- Expandable/collapsible analysis results
- Date/time formatting
- Empty state handling

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |


## Production Build

To build for production:

```bash
npm run build
```


