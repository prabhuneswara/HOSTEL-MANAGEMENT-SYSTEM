# HostelHub — Smart Hostel Management System

HostelHub is an investor-demo-ready, multi-tenant hostel management SaaS platform built with **React 18 + TypeScript**, **Vite**, **Tailwind CSS**, **Node.js + Express**, **Prisma ORM**, **JWT Authentication**, and **AI Intelligence features**.

---

## 🌟 Key Product Personas & Demo Credentials

| Role | Demo Email | Password | Persona & Key Capabilities |
|---|---|---|---|
| **STUDENT** | `student@hostelhub.com` | `Demo123!` | View room, file AI-categorized complaints, book laundry slots, request visitor passes, view fee dues & receipts, floating AI Assistant, emergency SOS. |
| **WARDEN** | `warden@hostelhub.com` | `Demo123!` | Unassigned complaint queue, assign specialty staff, approve/reject visitor gate passes, mark room roll-call attendance, post notices. |
| **STAFF** | `staff@hostelhub.com` | `Demo123!` | Assigned work orders list sorted by priority, mark tasks in-progress/resolved with photo proof uploads, laundry queue fulfillment. |
| **ADMIN** | `admin@hostelhub.com` | `Demo123!` | Executive KPIs, Recharts revenue & complaint trend analytics, user management CRUD, room allocations, AI Maintenance Summary Generator. |

> **Note**: The login screen features a **Quick Demo Persona Switcher** allowing instant one-click preview across all 4 roles without manually typing credentials.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS + HSL Design Tokens, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js (TypeScript), JWT Access + Refresh tokens, Zod Validation, Morgan
- **Database & ORM**: PostgreSQL, Prisma ORM, JSON/Mock persistence for zero-config evaluation
- **AI Services**:
  - **Complaint Auto-Categorizer & Priority Engine**: Analyzes issue title & description to predict category & urgency.
  - **Student Policy AI Chatbot**: Interactive floating widget answering hostel rules, laundry hours, visitor pass guidelines.
  - **Admin AI Maintenance Report Generator**: Synthesizes complaint clusters, average resolution time, and hotspot room recommendations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch

1. **Install dependencies across monorepo**:
   ```bash
   npm install
   ```

2. **Seed local demo database**:
   ```bash
   npm run db:seed
   ```

3. **Launch Web Application**:
   ```bash
   npm run dev:web
   ```
   Open `http://localhost:3000` in your browser.

4. **Launch API Backend**:
   ```bash
   npm run dev:api
   ```
   Server listens on `http://localhost:5000/api/v1`.

---

## 📊 Relational Database Schema Overview

```prisma
User ──< Student / Warden / Staff
User ──< Notification / AuditLog
Hostel ──< Room ──< RoomAllocation
Student ──< Complaint ──< ComplaintImage
Student ──< Visitor
Student ──< Laundry
Student ──< Attendance
Student ──< Payment
```

---

## ⚙️ Build & Production Deployment

To produce optimized production builds for Vercel / Render:
```bash
npm run build:web
npm run build:api
```
