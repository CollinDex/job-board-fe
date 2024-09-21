# Job Listing Platform

## Description

The Job Listing Platform is a web application that connects employers with job seekers. Employers can post jobs, manage applications, and view job listings, while job seekers can search for jobs, apply, and track the status of their applications. The platform features a responsive and interactive user interface, ensuring a seamless experience for both parties.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Employer Features**:
  - Create and manage job listings.
  - View and update company profile.
  - Track job applications from job seekers.
  - Edit and delete jobs.

- **Job Seeker Features**:
  - Search and apply for jobs.
  - View job listings with filters.
  - Track application status.
  - Update personal profile.

- **Authentication**:
  - User authentication with JWT.
  - Role-based access control (Employers, Job Seekers).

- **Responsive Design**:
  - Optimized for both mobile and desktop devices.

- **Interactive UI**:
  - Color-coded job application status.
  - Dynamic, responsive design using TailwindCSS.

## Technologies Used

- **Frontend**:
  - React
  - Redux (for state management)
  - React Router (for routing)
  - TailwindCSS (for styling)
  - React Toastify (for notifications)

- **Backend**: https://github.com/CollinDex/job-board-api
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JWT (for authentication)
  - Multer (for file uploads)

- **APIs**:
  - Custom RESTful API built using Express.js and MongoDB.

## Setup Instructions

### Prerequisites

- **Node.js** installed
- **MongoDB** installed locally or a MongoDB Atlas account.
- **Yarn** or **npm** installed globally.

### Steps to run the project:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/job-listing-platform.git
   cd job-listing-platform
   ```
2. **Install Packages**:

   ```bash
   npm install
   ```
3. **Run App**:

   ```bash
   npm start
   ``` 