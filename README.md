# Parking System Monitor

A modern web application for monitoring and managing parking systems.

## Features

- **Dashboard**: Real-time parking statistics and usage analytics
- **Parking Management**: Visual parking spot allocation with interactive controls
- **User Management**: Comprehensive user administration system
- **Reports**: Detailed analytics and reporting capabilities
- **Settings**: Configurable system parameters

## Technologies

- **Frontend**: React.js, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Build for production: `npm run build`

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js
│   ├── ParkingAllotment.js
│   ├── Users.js
│   ├── Report.js
│   ├── Settings.js
│   ├── Sidebar.js
│   ├── Header.js
│   └── ParkingSpot.js
├── App.js
└── index.js
```

## Design System

- **Colors**: Modern color palette with blue and gray tones
- **Typography**: Clean, readable fonts
- **Layout**: Responsive grid system
- **Components**: Reusable UI components

## Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Customization

All styling is done with Tailwind CSS classes, making it easy to customize:
- Colors in `tailwind.config.js`
- Component styles in individual files
- Global styles in `src/index.css`

## Deployment

This project is configured for deployment on Vercel with:
- Automatic builds from GitHub
- Environment variables for Supabase
- Optimized production builds

**Last updated**: 2024-03-20 - Vercel deployment fix
