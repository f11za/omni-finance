# OmniFinance 💳 
**A Full-Stack Financial Dashboard**

OmniFinance is a production-grade personal finance tracker that synchronizes real-time banking data into a high-performance visual dashboard. Built with a focus on data integrity, secure API handshakes, and responsive data visualization.

## Technical Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **API Integration:** Plaid (Transitions & Accounts)
- **Charts:** Recharts
- **Styling:** Tailwind CSS

## Key Engineering Challenges Solved
### 1. The Data Normalization Layer
Implemented a custom **Categorization Engine** in `lib/categorize.ts`. This layer uses pattern matching and keyword heuristics to map raw, inconsistent Plaid merchant strings into 8 clean, user-friendly spending categories.

### 2. High-Performance Sync Pipeline
Designed an **Idempotent Sync Engine** using Prisma's `upsert` operations. This ensures that even if a sync is triggered multiple times, the database maintains a unique record per transaction ID, preventing data duplication.

### 3. Connection Pooling & IPv6
Resolved complex database connectivity hurdles (Prisma P1001 errors) by configuring a **Supabase Connection Pooler**. This optimized the handshake between Vercel’s serverless functions and the PostgreSQL instance across different cloud regions.

## Local Setup
1. Clone the repo: `git clone https://github.com/YOUR_USERNAME/omni-finance.git`
2. Install dependencies: `npm install`
3. Set up your `.env` (see `.env.example`)
4. Sync the database: `npx prisma db push`
5. Start dev server: `npm run dev`
