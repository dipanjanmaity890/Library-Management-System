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

## Local Development Setup (Docker)

The absolute easiest way to run this project is using Docker. It automatically builds the database, imports the tables and dummy data, and starts the Node.js server.

### 1. Start the Environment
1. Ensure [Docker](https://www.docker.com/) is installed and running on your computer.
2. Open a terminal in the root directory of this project.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Docker will download MySQL, run the initialization scripts (`init-scripts/`), and launch the Node API on port `3000`.

### 2. Connect via TablePlus
If you want to view the database visually:
- **Host**: `127.0.0.1`
- **Port**: `3306`
- **User**: `root`
- **Password**: `library_root_password`
- **Database**: `LibraryManagementSystem`

### 3. Open the Frontend
1. Simply open `frontend/index.html` in your favorite web browser.
2. If you face CORS issues (due to `file://` protocol restrictions in some browsers), run a local server:
   ```bash
   npx serve frontend -p 8080
   ```
   and visit `http://localhost:8080`.

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
