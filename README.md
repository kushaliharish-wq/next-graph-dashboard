# next-graph-dashboard
This is a fullstack application that allows users to view and manage clinical trials and patient response data that I built to learn more about the GraphQL and Next.js tech stack.

# 🧪 Clinical Trial Dashboard  
*A Fullstack Project using Next.js, GraphQL, and Azure PostgreSQL*

## Overview

This project is a simple clinical trial dashboard built to explore fullstack development using:
- **Next.js (with TypeScript)** for frontend and routing
- **GraphQL Yoga** for API server implementation
- **Azure PostgreSQL** for cloud-hosted relational data

It allows users to:
- 🔍 Search and filter clinical trials by name and phase  
- 📄 View patient response data grouped by trial  
- ➕ Add new patient records via a form using GraphQL mutations

---

## Tech Stack

- **Frontend**: Next.js (TypeScript), React
- **Backend**: GraphQL Yoga served via Next.js API routes
- **Database**: Azure PostgreSQL
- **GraphQL Client**: `graphql-request`
- **Hosting**: Designed for deployment on platforms like Netlify or Vercel

## 🛠 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/clinical-trial-dashboard.git
   cd clinical-trial-dashboard
2. ** Install dependencies
   ```bash
   npm install
   
3. Configure environment variables

  Create a .env.local file:

  ```bash
    PGHOST=your-postgres-host
    PGUSER=your-db-user
    PGPASSWORD=your-db-password
    PGDATABASE=clinical_trials
    PGPORT=5432

4. Start the development server
  ```bash
    npm run dev
