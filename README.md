# DoubtShare Documentation

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Application Structure](#application-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Endpoints](#api-endpoints)
- [WebSocket Communication](#websocket-communication)
- [Usage](#usage)
  - [Student Interaction](#student-interaction)
  - [Tutor Interaction](#tutor-interaction)


## Introduction

DoubtShare is an interactive real-time doubt-solving platform designed to assist students with their academic queries. This documentation provides an overview of the application's features, tech stack, and instructions for setting up and running the application.

## Features

- **User Authentication:** Users can log in or register as students or tutors.
- **Doubt Request:** Students can create doubt requests, and online tutors matching the criteria are notified in real-time.
- **Real-Time Communication:** Utilizes WebSocket for real-time communication between students and tutors.
- **Doubt History:** Students can view their doubt history on the platform.

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB
- Real-Time Communication: WebSocket (Socket.io)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running
- React development environment set up

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/DoubtShare.git
   ```

2. Navigate to the project directory:

   ```bash
   cd DoubtShare
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the MongoDB server.

2. Run the backend server:

   ```bash
   cd backend
   npm start
   ```

3. Run the frontend:

   ```bash
   cd frontend
   npm start
   ```

   The application should now be accessible at `http://localhost:3000`.

## Application Structure

### Backend

The backend is built with Node.js and Express. It handles user authentication, doubt request processing, and WebSocket communication.

- `server.js`: Main entry point for the Express application.
- `routes/`: Contains API routes for user authentication and doubt handling.
- `models/`: MongoDB data models for users and doubt requests.
- `utils/`: Utility functions.

### Frontend

The frontend is developed using React and interacts with the backend through API calls and WebSocket communication.

- `src/`: Contains React components, styles, and services.
- `components/`: Reusable React components.
- `services/`: Functions for API calls and WebSocket communication.

## API Endpoints

- `POST /api/auth/register`: User registration endpoint.
- `POST /api/auth/login`: User login endpoint.
- `GET /api/user/one`: Get user details.
- `POST /api/doubt/create`: Create a doubt request.

## WebSocket Communication

The application uses WebSocket communication for real-time updates.

- `tutorOnline`: Notifies the server when a tutor comes online.
- `doubtRequest`: Emits a doubt request from a student to available tutors.
- `tutorResponse`: Handles a tutor's response to a doubt request.
- `sendMessage`: Sends a message in the chat room between a tutor and student.

## Usage

### Student Interaction

1. Log in or register as a student.
2. Ask a doubt by entering your question and clicking "Ask Doubt."
3. Wait for available tutors to respond.
4. If a tutor accepts, a chat interface is triggered.

### Tutor Interaction

1. Log in or register as a tutor.
2. Receive notifications for doubt requests matching your expertise.
3. Accept or reject a doubt request.
4. If accepted, a chat interface is triggered.

