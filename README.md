# PrepNG — Nigerian Exam Prep

Subscription exam-prep for **JAMB**, **WAEC**, **NECO**, and **POST-UTME**.

## Features

- **2,000+ questions** across 29 subject packs (2021–2024)
- CBT practice (timer, palette, mark-for-review)
- Detailed explanations
- **User accounts** — email/password or phone OTP (Supabase)
- Subscription synced to account (Paystack)
- Offline question packs + installable PWA

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup (accounts)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` → `.env.local` and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run the SQL in `supabase/migrations/001_profiles.sql` in the Supabase SQL Editor
4. Enable **Email** auth in Authentication → Providers
5. For **phone OTP**: enable Phone provider and connect an SMS service (Termii, Twilio, etc.)

### Auth routes

| Route | Purpose |
|-------|---------|
| `/signup` | Email or phone registration |
| `/login` | Email/password or phone OTP |
| `/account` | Profile + subscription status |

## Paystack setup

Add `PAYSTACK_SECRET_KEY` to `.env.local`. When a user is signed in, successful payments update their `profiles` row automatically.

## Question bank structure

```
src/data/questions/
  manifest.json          # pack metadata + total count
  index.ts               # auto-generated imports
  packs/
    jamb-mathematics.json
    waec-english.json
    ...                  # 29 packs × 69 questions ≈ 2,000
```

### Regenerate questions

```bash
npm run generate:questions
```

Edit `scripts/generate-questions.mjs` to add templates, then re-run. Replace generated content with licensed past questions as you acquire them.

### Add your own questions manually

Create or edit a file in `src/data/questions/packs/`:

```json
{
  "id": "jamb-math-2024-021",
  "exam": "JAMB",
  "subject": "Mathematics",
  "year": 2024,
  "topic": "Algebra",
  "text": "Your question here",
  "options": [
    { "key": "A", "text": "..." },
    { "key": "B", "text": "..." }
  ],
  "correctAnswer": "B",
  "explanation": "Step-by-step solution"
}
```

Then run `npm run generate:questions` to refresh `index.ts`, or add the import manually.

## Deploy

Deploy to Vercel. Set all env vars from `.env.example` in the project settings.

## Project structure

- `src/lib/supabase/` — auth clients
- `src/lib/user-subscription.ts` — account-aware usage + billing
- `src/app/api/user/` — profile, subscription, usage APIs
- `scripts/generate-questions.mjs` — question bank generator
