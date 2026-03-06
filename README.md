# RAME Tech Consultancy Website

A professional consultancy website built with Next.js, React, TypeScript, and Tailwind CSS.

## Project Overview

This website is for RAME Tech Consultancy, a Ghana-based tech company offering:
- Software Development
- Hardware & IT Services
- Graphic Design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcrypt
- **Payments:** Stripe (ready for integration)

## Project Structure

```
rametech-website/
├── prisma/
│   ├── schema.prisma      # Database schema (10 models)
│   └── seed.ts            # Seed data
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Homepage
│   │   ├── services/      # Services page
│   │   ├── portfolio/    # Portfolio page
│   │   ├── blog/         # Blog page
│   │   ├── faq/          # FAQ page
│   │   ├── contact/      # Contact page
│   │   ├── portal/       # Client Portal
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── invoices/page.tsx
│   │   │   └── profile/page.tsx
│   │   └── api/v1/       # API Routes
│   │       ├── services/
│   │       ├── portfolio/
│   │       ├── blog/
│   │       ├── faq/
│   │       ├── contact/
│   │       ├── quotes/
│   │       ├── newsletter/
│   │       ├── chatbot/lead/
│   │       ├── portal/
│   │       └── webhooks/
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── homepage/     # Hero, Services, Portfolio, CTA
│   │   ├── shared/       # SEO, etc.
│   │   └── chatbot/      # AI Chatbot
│   ├── lib/              # Utilities (db, auth, api-response)
│   └── types/            # TypeScript definitions
└── README.md
```

## Features

### ✅ Public Pages
- Homepage with hero, services overview, portfolio preview, CTA
- Services page with detailed service listings
- Portfolio page with project showcase
- Blog page with article grid
- FAQ page with common questions
- Contact page with validated form

### ✅ AI Chatbot
- FAQ matching system
- Lead capture integration
- WhatsApp escalation
- Rate limiting (20 messages/session)

### ✅ Client Portal
- User authentication (login/register)
- Dashboard with project overview
- Project tracking with progress bars
- Invoice viewing and management
- Profile management with password change

### ✅ API Endpoints
- `/api/v1/services` - GET services
- `/api/v1/portfolio` - GET portfolio projects
- `/api/v1/blog` - GET blog posts (paginated)
- `/api/v1/faq` - GET FAQs
- `/api/v1/contact` - POST contact form
- `/api/v1/quotes` - POST quote requests
- `/api/v1/newsletter` - POST subscribe, DELETE unsubscribe
- `/api/v1/chatbot/lead` - POST chatbot leads
- `/api/v1/portal/auth/*` - Portal authentication
- `/api/v1/portal/projects` - Project CRUD
- `/api/v1/portal/invoices` - Invoice listing
- `/api/v1/webhooks/*` - Stripe & chatbot webhooks

### ✅ Database Schema (PostgreSQL)
- TeamMember
- Service
- PortfolioProject
- BlogPost
- FAQ
- QuoteRequest
- ContactMessage
- NewsletterSubscriber
- PortalUser
- Project
- Invoice
- ChatbotLead

### ✅ SEO
- Dynamic metadata generation
- Open Graph tags
- Twitter card support
- JSON-LD structured data (Organization, LocalBusiness)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your values
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push schema to database:
```bash
npm run db:push
```

5. Seed initial data:
```bash
npx ts-node prisma/seed.ts
```

6. Run development server:
```bash
npm run dev
```

7. Open http://localhost:3000

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rametech

# JWT
JWT_SECRET=your-super-secret-key

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Chatbot
CHATBOT_SYSTEM_PROMPT="You are the RAME Tech virtual assistant..."
WHATSAPP_LINK=wa.me/233557332615
```

## Building for Production

```bash
npm run build
npm start
```

---

Built based on Technical Specification Document (TSD) v1.0
All features from the proposal have been implemented.
