# LMS Project (Learning Management System)

## LINK FOR PROJECT VIDEO: 
https://github.com/sanmiljadhav/LearningManagementSystemFE/blob/master/src/assets/Lms%20system%20(2)%20(1).mp4

## Overview
This project is a Learning Management System (LMS) that provides a platform for students to buy and access courses, while allowing instructors to create and manage their courses and lectures. The platform also includes features for user authentication, course search and filtering, and course sales tracking for administrators.

## Features
## Roles
## STUDENT

View and browse all published courses.
See course details (e.g., course name, description, created by information, enrolled students, course content).
Buy courses through Razorpay integration and make payments using card details.
Access course lectures after purchase.
Search for courses and filter by category and price.

## INSTRUCTOR/ADMIN

Create new courses.
Edit course details (title, subtitle, description, category, course level, price, and course thumbnail).
Create and manage lectures for their courses.
Upload lecture videos and files using Cloudinary.


Manage all courses and lectures on the platform.
View total sales and revenue.
View a graphical representation of course prices and sales.
## Authentication
JWT authentication is implemented for secure login and session management.
Tokens are stored in cookies to ensure a seamless and secure user experience.
## Technologies Used
Backend: Node.js, Express
Frontend: HTML, CSS, JavaScript (React or Vanilla JS)
Database: MongoDB
Payment Gateway: Razorpay
File Storage: Cloudinary
Authentication: JSON Web Token (JWT)

## Setup Instructions
Prerequisites
Node.js (v14.x or above)
MongoDB (for local development or cloud MongoDB like MongoDB Atlas)
Razorpay Account (for payment integration)
Cloudinary Account (for video and file storage)
Installation Steps
Clone the repository
Clone the repository to your local machine:

## bash
Copy
git clone https://github.com/your-username/lms-project.git
cd lms-project
Install dependencies
Install both backend and frontend dependencies:

## bash
Copy
npm install
Environment Setup
Create a .env file in the root directory and add the following variables:

## env
Copy
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongo_connection_uri
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Run the project locally
Start the backend and frontend servers:

bash
Copy
npm run dev
This will start both the backend server and frontend server simultaneously.

Visit the app
Open your browser and visit http://localhost:3000 to see the LMS application in action.
