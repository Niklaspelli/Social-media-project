🧩 Full-Stack Social Platform – Documentation ***UPDATED 2025.05.05.****
📚 Project Summary
This is a full-stack social networking platform that enables user registration, login, profile management, and social interactions such as sending friend requests. It is designed using modern web development tools and follows best practices for scalability, modularity, and security.

🛠️ Tech Stack
Layer	Technology
Frontend	React (with Vite), React Router, Bootstrap
Backend	Node.js, Express.js
Database	MySQL
Auth	JWT (JSON Web Tokens), HTTPOnly cookies
Deployment	Vite for fast development builds

🔐 Security Measures
Password Hashing: All user passwords are securely hashed using bcrypt before storing in the database.

JWT Authentication: Secure login flow using access tokens, stored in HTTPOnly cookies to prevent XSS attacks.

Authorization Middleware: Custom middleware checks token validity and protects API routes from unauthorized access.

CORS Config: Backend uses CORS with credentials enabled, allowing only trusted origins.

SQL Injection Protection: All queries are parameterized using ? placeholders to avoid injection vulnerabilities.

Route Protection: React routes are guarded with a ProtectedRoute component that checks authentication state.

This is what it will feature over time:

🧑‍💻 Features
👥 Authentication & Users
Secure login & registration

Token-based session handling

User profile with editable info

Role-based rendering (e.g., hide friend buttons on your own profile)

🤝 Friend System
Send, accept, and reject friend requests

Real-time status updates after action

Friend status indicator on profile

Separate logic for sender/receiver UI states

📦 Modular Structure
Frontend: Modular React components (UserProfile, FriendRequest, AuthPage, etc.)

Backend: RESTful API routes, clean controller separation (e.g., authController.js, friendController.js)

Database: Structured MySQL schema with foreign key relationships (users, friend_requests)



 Development Notes
Built with React Vite for fast refresh and optimized builds

Environment variables are used to store sensitive configs

Uses React Context API for global authentication state

All sensitive routes are protected both frontend and backend

Clean separation of concerns via routes, controllers, middleware



