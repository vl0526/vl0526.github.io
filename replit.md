# Overview

This is a Vietnamese quiz application built with a modern full-stack architecture. The application features an interactive quiz interface with anti-cheat measures, power-ups (50:50, freeze timer, hint), real-time communication between browser tabs, and an admin panel for quiz management. The frontend is built with React and styled using Tailwind CSS with shadcn/ui components, while the backend uses Express.js with PostgreSQL database integration via Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with a simple switch-based route system
- **State Management**: React hooks for local state, TanStack Query for server state, and local storage hooks for persistence
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS styling
- **Styling**: Tailwind CSS with custom CSS variables for theming, including Vietnamese-specific design elements
- **Animations**: Framer Motion for smooth transitions and interactive elements

## Backend Architecture
- **Framework**: Express.js with TypeScript in ESM format
- **Database Layer**: Drizzle ORM with PostgreSQL using Neon serverless driver
- **Development Setup**: Vite middleware integration for hot module replacement during development
- **Error Handling**: Centralized error handling middleware with structured JSON responses
- **Logging**: Custom request/response logging system for API endpoints

## Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations with schema definitions in TypeScript
- **Connection**: Neon serverless PostgreSQL with WebSocket support
- **Local Storage**: Browser localStorage for quiz state persistence and user preferences

## Authentication & Security
- **Anti-Cheat System**: Custom hooks monitoring tab switching, right-click prevention, and keyboard shortcut blocking
- **Admin Access**: PIN-based authentication system for administrative functions
- **Real-time Monitoring**: BroadcastChannel API for cross-tab communication and cheat detection

## External Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Framework**: Radix UI primitives for accessible components
- **Icons**: Lucide React icons and Font Awesome via CDN
- **Fonts**: Google Fonts (Inter, Playfair Display) for typography
- **Development**: Replit-specific plugins for development environment integration
- **Real-time Features**: Native BroadcastChannel API for tab synchronization

## Key Features
- **Quiz Management**: Dynamic question loading with CRUD operations via admin panel
- **Power-up System**: 50:50 elimination, timer freeze, and hint functionality
- **Anti-Cheat Protection**: Multi-layered detection system with strike-based penalties
- **Responsive Design**: Mobile-first approach with adaptive UI components
- **Persistence**: State preservation across browser sessions using localStorage
- **Real-time Sync**: Cross-tab communication for coordinated quiz experiences