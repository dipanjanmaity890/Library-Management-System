# Library Management System

A full-stack, premium Library Management System built with Node.js, Express, MySQL, and a beautiful custom-styled vanilla JavaScript frontend.

## Features
- **Books Catalog**: View, Add, and Delete books.
- **Member Management**: Track library members.
- **Borrowing Transactions**: Check books out to members, and mark them returned instantly.
- **Live Dashboard**: View real-time statistics on your library's status.
- **Premium UI**: Designed with modern dark mode and glassmorphism elements.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS, Vanilla JS
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Local Development Setup

### 1. Database Setup
1. Ensure MySQL is running on your computer.
2. Run the `schema.sql` file in your MySQL environment to create the `LibraryManagementSystem` database and all required tables.
3. Run the `operations.sql` file to seed the database with initial sample data.

### 2. Backend Setup
1. Navigate to the root directory where `package.json` is located.
2. Run `npm install` to install the backend dependencies.
3. Create a file named `.env` in the root directory (do not commit this file). Add your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=LibraryManagementSystem
   PORT=3000
   ```
4. Start the server by running `node backend/server.js`.

### 3. Frontend Setup
1. Simply open `frontend/index.html` in your favorite web browser. No frontend build step is required!

## Deployment Guide

To deploy this project live so anyone on the internet can access it, follow these steps:

### 1. Database Hosting
You cannot use your local MySQL database for a live website.
- Create a free managed MySQL database using a service like [Aiven](https://aiven.io/) or [Railway](https://railway.app/).
- Run your `schema.sql` and `operations.sql` scripts on this new live database.
- Obtain your live database credentials (Host, User, Password, Port).

### 2. Backend Hosting (Node.js)
GitHub Pages cannot run backend Node.js code.
- Deploy this repository to a service like [Render](https://render.com/) or [Railway](https://railway.app/).
- In the dashboard of your chosen hosting provider, add the Environment Variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) matching your live database.
- The server will now automatically connect to your live database instead of `localhost`.
- Obtain the public URL for your deployed backend API (e.g., `https://my-library-api.onrender.com`).

### 3. Frontend Hosting
- Update the `API_BASE_URL` at the top of `frontend/app.js` to point to your new live backend URL (instead of `http://localhost:3000/api`).
- Deploy the `frontend/` folder to [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/), or [Netlify](https://www.netlify.com/).

---
*Created as part of a DBMS capstone project focusing on classical relational database design.*
