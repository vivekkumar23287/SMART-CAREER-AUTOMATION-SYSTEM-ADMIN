# Smart Career Automation - Premium Admin Dashboard

This is a premium administrative interface for the Smart Career Automation system, built with Next.js 14, Tailwind CSS, and Neon Postgres.

## Setup Instructions

Since I encountered a system limitation preventing me from running terminal commands directly, please follow these steps to get the dashboard running:

1. **Navigate to the directory**:
   ```bash
   cd "d:\VIVEK\PROJECT\CV project ADDMIN"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Verify Environment Variables**:
   Check the `.env.local` file. It already contains your `DATABASE_URL` and admin credentials.
   - `ADMIN_EMAIL`: addmin739@gmail.com
   - `ADMIN_PASSWORD`: admin123 (Change this as needed)

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Dashboard**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Secure Login**: Protected by middleware and session cookies.
- **Payment Verification**: 
  - List all pending payments from `ai_tool_payments`.
  - Automatic base64 screenshot decoding with full-screen preview.
  - One-click approval that updates expiry to 30 days.
- **User Management**:
  - Searchable list of all users from `applications`.
  - Quick access to user resumes.
- **Premium Design**: Dark mode aesthetic with glassmorphism, gold accents, and smooth animations using Framer Motion.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Neon Postgres (@neondatabase/serverless)
- **Icons**: Lucide React
- **Animations**: Framer Motion
