# simple-auth
`simple-auth` is a full-stack application demonstrating a complete authentication system using JWTs. It includes a Node.js/Express backend that handles user registration, login, and session management with token refreshing, and a Vue.js frontend for the user interface. The application also features a simple note-taking functionality where users can create, view, update, and delete their own public or private notes.

## Features

*   **User Authentication**: Secure user signup and login functionality.
*   **JWT-Based Sessions**: Authentication is managed using JSON Web Tokens (JWT), including a token refresh mechanism to maintain user sessions.
*   **Role-Based Access**: Simple implementation of 'user' and 'admin' roles.
*   **Notes CRUD**: Authenticated users can create, read, update, and delete their personal notes.
*   **Public & Private Notes**: Notes can be marked as public (visible to all visitors on the homepage) or private (visible only to the creator).
*   **RESTful API**: A well-defined backend API for handling auth and notes operations.
*   **Responsive UI**: A clean user interface built with Vue.js and Bootstrap.

## Tech Stack

*   **Backend**:
    *   Node.js
    *   Express
    *   MongoDB (with `monk` as the client)
    *   JSON Web Token (`jsonwebtoken`) for authentication
    *   `bcryptjs` for password hashing
    *   `Joi` for request validation
    *   `Pino` for logging
    *   `helmet` and `cors` for security
*   **Frontend**:
    *   Vue.js 3
    *   Vite
    *   Pinia for state management
    *   Vue Router for client-side routing
    *   Axios for API requests
    *   Bootstrap & Bootstrap Icons for styling

## Project Structure

The repository is a monorepo containing two main parts:

*   `server/`: The Node.js backend application that provides the REST API.
*   `client/`: The Vue.js frontend application that consumes the API.

## Setup and Installation

### Prerequisites

*   Node.js (v16.0.0 or higher)
*   npm (v10.0.0 or higher)
*   A running MongoDB instance

### Backend Setup

1.  **Navigate to the server directory:**
    ```sh
    cd server
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create an environment file:**
    Create a `.env` file in the `server/` root and populate it with your MongoDB connection string and a JWT secret. You can use `.env.sample` as a template.
    ```env
    MONGO_DB_URI=YOUR_MONGO_DB_URI
    SECRET=YOUR_JWT_SECRET
    ```
4.  **Start the server:**
    The server will run on `http://localhost:3000`.
    ```sh
    npm run dev
    ```

### Frontend Setup

1.  **Navigate to the client directory:**
    ```sh
    cd client
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Start the development server:**
    The Vue application will be available at the address provided by Vite (usually `http://localhost:5173`).
    ```sh
    npm run dev
    ```

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (`/auth`)

| Method | Endpoint         | Description                                                          | Access         |
| :----- | :--------------- | :------------------------------------------------------------------- | :------------- |
| `POST` | `/signup`        | Creates a new user account and returns a JWT.                        | Public         |
| `POST` | `/login`         | Authenticates a user and returns a JWT.                              | Public         |
| `GET`  | `/checkuser`     | Verifies the current user's token and returns user data.             | Authenticated  |
| `GET`  | `/refresh-token` | Issues a new JWT if the current one is close to expiring.            | Authenticated  |

### Notes (`/notes`)

| Method   | Endpoint       | Description                                                    | Access                     |
| :------- | :------------- | :------------------------------------------------------------- | :------------------------- |
| `GET`    | `/`            | Gets all notes belonging to the authenticated user.            | Authenticated              |
| `POST`   | `/`            | Creates a new note for the authenticated user.                 | Authenticated              |
| `PATCH`  | `/:id`         | Updates a specific note belonging to the authenticated user.   | Authenticated (Owner only) |
| `DELETE` | `/:id`         | Deletes a specific note belonging to the authenticated user.  | Authenticated (Owner only) |
| `GET`    | `/all-public`  | Gets all notes from all users that are marked as public.       | Public                     |
| `GET`    | `/all`         | Gets all notes from all users.                                 | Admin                      |
| `GET`    | `/:id`         | Gets a specific note by its ID.                                | Admin                      |
