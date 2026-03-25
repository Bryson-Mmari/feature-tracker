# Feature Tracker

A full-stack feature request tracker built with React, TypeScript, Node.js, Express, and MySQL.

This project helps teams capture feature requests, review details in a clean UI, and move requests through a simple workflow from `Open` to `In Progress` to `Completed`.

## Overview

The repository contains:

- `feature-tracker-frontend`: a React + TypeScript + Vite frontend
- `feature-tracker-backend`: an Express + TypeScript REST API
- `feature-tracker-backend/sql/schema.sql`: the database schema used by the backend

## Features

- Create, edit, view, and delete feature requests
- Filter feature requests by status
- Paginate request results
- Move requests through controlled status transitions
- Prevent invalid status changes in the UI
- Delete confirmation modal for destructive actions
- Light and dark theme toggle
- Toast notifications for success, info, warning, and error states
- Mobile-first responsive interface

## Workflow Rules

The frontend currently enforces these request rules:

- `Open` requests can be edited, deleted, or moved to `In Progress` or `Completed`
- `In Progress` requests can be edited and moved only to `Completed`
- `Completed` requests are view-only

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Axios
- React Toastify
- ESLint

### Backend

- Node.js
- Express
- TypeScript
- MySQL
- dotenv
- cors

## Project Structure

```text
feature-tracker/
├── feature-tracker-backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── sql/
│   ├── types/
│   ├── .env.example
│   ├── app.ts
│   └── package.json
└── feature-tracker-frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js `20.19+` or `22.12+`
- npm | pnpm
- MySQL

Note: the frontend uses Vite 8, which requires a newer Node version than Node 18.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd feature-tracker
```

### 2. Set up the backend

```bash
cd feature-tracker-backend
npm install
cp .env.example .env
```

Update `.env` with your local MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=feature_tracker
```

### 3. Create the database

Run the schema file in MySQL:

```bash
mysql -u your_db_user -p < sql/schema.sql
```

This creates:

- database: `feature_tracker`
- table: `feature_requests`

### 4. Start the backend

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

### 5. Set up the frontend

Open a new terminal:

```bash
cd feature-tracker-frontend
npm install
npm run dev
```

The frontend runs on the Vite dev server, usually:

```text
http://localhost:5173
```

## Available Scripts

### Frontend

From `feature-tracker-frontend`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

From `feature-tracker-backend`:

```bash
npm run dev
npm run build
npm start
```

## API Endpoints

Base URL:

```text
http://localhost:5000/api/features
```

Endpoints:

- `GET /api/features` - fetch all features with pagination
- `GET /api/features?status=Open&page=1&limit=5` - fetch filtered features
- `POST /api/features` - create a feature request
- `PUT /api/features/:id` - update a feature request
- `PATCH /api/features/:id/status` - update only the status
- `DELETE /api/features/:id` - delete a feature request

## Sample Request Payload

```json
{
  "title": "Add export to CSV",
  "description": "Allow admins to export filtered requests.",
  "priority": "High",
  "status": "Open"
}
```

## Git History

The project was organized into milestone-style branches and commits, including:

- `Initial project setup`
- `Create database schema`
- `Add backend CRUD APIs`
- `Connect frontend to backend`
- `Add filtering feature`
- `UI improvements`

If you publish this repository, those commits provide a clean progression of the project history.

## Future Improvements

- Add automated frontend and backend tests on the main branch
- Add authentication and role-based permissions
- Add search by title or keyword
- Add deployment instructions for production
- Add Docker support

## Author

Bryson Mmari, a full-stack Developer, this is my gitbuh profile (https://github.com/Bryson-Mmari), and project repository https://github.com/Bryson-Mmari/feature-tracker.
