# REI CRM
A Pebble-inspired real estate investor CRM built for wholesalers and land investors.

## Stack
- **Frontend:** React 18 + Tailwind CSS + React Router v6 + Recharts
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL

## Quick Start

### 1. Backend
```bash
cd server && cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

### 2. Frontend
```bash
cd client && npm install && npm run dev
```

Visit http://localhost:5173 and register an account.

## Features
- Kanban deal boards: Seller Deals, Buyer Deals, Inventory
- Contacts database with REI categories
- Properties database with APN/parcel tracking
- Direct mail campaigns
- Inboxes (calls, texts, emails)
- Tasks management
- Auto Followup drip plans
- Templates (mail, email, text)
- Dashboard with analytics
