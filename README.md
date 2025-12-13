# Modexx – Full Stack Ticket Booking System

This repository contains the full-stack implementation for the **Modexx Assessment**.  
The project provides a seat-booking platform with separate frontend and backend deployments, using **React + TypeScript**, **Node.js**, and **MongoDB Atlas**.

---

## 🚀 Features
- View available shows
- Create shows (admin)
- Select and book seats
- **Concurrency-safe seat booking** using MongoDB atomic updates / transactions
- Booking statuses: **PENDING**, **CONFIRMED**, **FAILED**
- Fully deployed backend + frontend as required in the assessment

---

## 📁 Project Structure
```
├── client/ # React + TypeScript frontend
├── server/ # Node.js backend (Express + MongoDB)
├── DEPENDENCIES.md
├── IMPLEMENTATION_STEPS.md
├── requirements.txt # Optional python utilities
└── README.md
```
---
Frontend Setup
cd client
npm install
npm start
---
## 🛠 Backend Setup (server/)
cd server
npm install
---
Database (MongoDB Atlas)
Backend Deployment (Render)
Frontend Deployment (Vercel / Netlify)

