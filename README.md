<div align="center">

# BPBS: Bhakti Pratap Bhajana Sangha

**A spiritual home online for japa chanting, kirtans, courses, events and devotional service.**

[**Live site → bpbs.vercel.app**](https://bpbs.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat-square&logo=razorpay&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## What it does

BPBS brings the community's daily practice and activities into one mobile-first app.

### For devotees
- **Japa counter:** chant on a 108-bead mala, count your rounds and save every session to your account
- **Sadhana reporting:** log your daily practice and look back on your progress
- **Kirtans:** listen to the kirtan library, with play counts
- **Courses:** enroll, work through lessons and track your progress
- **Reading room:** read devotional books in the browser
- **Events:** browse upcoming programmes and RSVP
- **Seva:** find volunteer opportunities and sign up
- **Donations:** give securely through Razorpay and see your donation history
- **Profile:** your courses, donations and notifications in one place

### For administrators
A built-in admin panel manages **users, events, courses and lessons, kirtans, books, seva opportunities, donations, homepage slides and custom content pages**. No code changes are needed to update the site.

### Sign-in
Phone OTP (Fast2SMS, with MSG91 as a fallback), Google sign-in, or username and password. Built on Auth.js (NextAuth v5).

## Tech stack

| Layer | Choice |
| :-- | :-- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | Auth.js / NextAuth v5 with Google and OTP, bcrypt-hashed passwords |
| Payments | Razorpay |
| Charts | Recharts |
| Validation | Zod |
| Styling | Tailwind CSS 4, Lucide icons |

## Project structure

```
app/
├── japa/  kirtan/  courses/  reading/  events/  seva/  donate/  reporting/
├── profile/           # My courses, my donations
├── admin/             # Users, events, courses, kirtans, books, seva, donations, slides, pages
├── pages/[slug]/      # CMS-driven content pages
└── api/               # Auth (OTP, signup), public + admin APIs
components/            # Header, BottomNav, Slideshow, BookEditor, PageEditor, ...
prisma/
├── schema.prisma      # User, Event, Course, Lesson, Kirtan, JapaSession, SadhnaReport, Donation, Book, ...
└── seed.ts
scripts/               # Admin setup and content seeding
```

## Getting started

**Requirements:** Node.js 20+ and a PostgreSQL database.

```bash
git clone https://github.com/anandbajrangi1/BPBS.git
cd BPBS
npm install            # also runs `prisma generate`
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
AUTH_SECRET="a-long-random-string"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# SMS OTP: set one provider
FAST2SMS_API_KEY=""
MSG91_AUTH_KEY=""
MSG91_TEMPLATE_ID=""
```

Set up the database and run the app:

```bash
npm run db:migrate     # create tables
npm run db:seed        # optional: sample content
npm run dev            # http://localhost:3000
```

### Set the admin password

Run the interactive setup, which asks for the username and password:

```bash
npx tsx scripts/setup-admin-password.ts
```

Or run it non-interactively with environment variables:

```bash
ADMIN_USERNAME="admin" ADMIN_PASSWORD="choose-a-strong-password" npx tsx scripts/raw-admin-update.ts
```

## Scripts

| Command | What it does |
| :-- | :-- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push the schema without a migration |
| `npm run db:seed` | Seed sample data |

---

<div align="center">
<sub>Built by <a href="https://github.com/anandbajrangi1">Anand Bajrangi</a> · <a href="https://evolvcode.com">Evolvcode Solutions</a></sub>
</div>
