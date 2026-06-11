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
5. For **phone OTP** via Termii, see [Termii SMS setup](#termii-sms-setup-phone-otp) below

### Auth routes

| Route | Purpose |
|-------|---------|
| `/signup` | Email or phone registration |
| `/login` | Email/password or phone OTP |
| `/account` | Profile + subscription status |

## Termii SMS setup (phone OTP)

Termii is **not** a built-in Supabase SMS provider. PrepNG sends OTPs **directly through Termii** from `/api/auth/phone/send-otp` — no Supabase Auth hook or Phone provider setup required.

### 1. Termii account

1. Sign up at [termii.com](https://termii.com) and copy your **API key** and **Base URL** from the dashboard.
2. Register a **Sender ID** (e.g. `PrepNG`) and wait for approval.
3. Ask Termii support to enable the **DND (transactional)** route — required for reliable OTP delivery in Nigeria.

### 2. Database migration

Run `supabase/migrations/005_phone_otps.sql` in the Supabase SQL Editor (stores OTP hashes server-side).

### 3. Environment variables

Add to `.env.local` and Vercel (Production):

| Variable | Description |
|----------|-------------|
| `TERMII_API_KEY` | API key from Termii dashboard |
| `TERMII_SENDER_ID` | Approved sender ID (3–11 chars) |
| `TERMII_BASE_URL` | Your Termii base URL (often `https://api.ng.termii.com`) |
| `TERMII_CHANNEL` | `dnd` for OTP (recommended) |
| `PHONE_OTP_SECRET` | Long random string for hashing OTP codes |
| `SUPABASE_SERVICE_ROLE_KEY` | Required to create phone users after OTP verify |

### 4. Test

1. Open `/login` or `/signup`, choose **Phone OTP**, enter a Nigerian number (`080…` or `+234…`).
2. You should receive: `Your PrepNG verification code is 123456…`
3. If it fails, check Vercel logs for `/api/auth/phone/send-otp` and confirm Termii balance + DND route.

## Paystack setup

1. Add `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` to `.env.local` / Vercel env.
2. Set **Webhook URL** in Paystack Dashboard → **Settings → API Keys & Webhooks** (Live mode):
   ```
   https://prepng.com/api/paystack/webhook
   ```
3. Under **Events to send**, add **`charge.success`** and save.
4. Set `NEXT_PUBLIC_SITE_URL=https://prepng.com` so payment callbacks use the custom domain.

When a user is signed in, successful payments activate their plan via the return URL or the webhook (`charge.success` with `metadata.app=prepng`).

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
