
# BonusPlay AI Book Creator 📚✨

**Create your own magical storybook from just one idea — with AI-powered writing and beautiful illustrations.**  
This is the official source code for [https://www.bonusplay.com](https://www.bonusplay.com).

---

## 🚀 Live Demo

👉 Coming soon: [https://www.bonusplay.com](https://www.bonusplay.com)

---

## ✨ Key Features

- 🔮 **Surprise Me** → instant AI-generated book from your idea
- 🎛️ **Let Me Guide It** → creative flow with editable outline & content
- 🎨 **AI-illustrated covers** with DALL·E
- 📝 **Editable story** with rich text editor (TipTap)
- 💳 **Stripe payments** for unlocking full books
- 📄 **PDF generation** & delivery via email (Resend)
- 📈 **Analytics** (PostHog)
- 🛠 **Error monitoring** (Sentry)
- ☁️ **Supabase** for storage & user data
- 🚀 Built with **Next.js**, **MUI**, **OpenAI GPT-4 / DALL·E APIs**

---

## 🎮 User Workflow & Experience (v2)

### 🔰 Step 0: Initial Landing Page (bonusplay.com)

- Central input: _"Imagine your own book from just one idea..."_
- Two buttons:
  - 🔮 Surprise Me
  - 🎛️ Let Me Guide It

---

### ✨ Option 1: Surprise Me (Fast Experience for Casual Users)

#### Step 1: Generate Quick Preview
- GPT-4: Title + Short intro
- DALL·E: Cover image

#### Step 2: Display Preview
- Cover + Title + 1 paragraph preview
- CTA → Unlock your book

#### Step 3: Stripe Payment
- Pay BEFORE full generation
- Book ID & email saved pre-payment

#### Step 4: Post-Payment (Stripe Webhook 🚀)
- Full book generated (GPT-4)
- Final PDF generated
- Stored in Supabase
- Email sent (Resend)
- Thank You page with:
  - Download
  - Optional upsells: Print / Narrate

---

### 🎨 Option 2: Let Me Guide It (For Creative Users)

#### Step 1: Generate Outline
- GPT-4: Title + structure + tone
- User selects tone or regenerates outline/title

#### Step 2: Confirm + Generate Draft
- GPT-4: Full draft content
- DALL·E: Cover image

#### Step 3: User Editing
- Rich editor (TipTap)
- Cover preview
- Auto-save edits
- User proceeds to purchase

#### Step 4: Stripe Checkout
- Pay AFTER editing
- Book ID & email stored

#### Step 5: Post-Payment (Stripe Webhook 🚀)
- Final user-edited PDF generated
- Stored in Supabase
- Email sent (Resend)
- Thank You page with download + upsells

---

## 🧱 Backend Mapping

| Stage      | Task |
|------------|------|
| Step 1 (Outline) | GPT-4 call for structure + tone |
| Step 2 (Draft) | GPT-4 call for full content |
| Step 3 (Editor) | Store TipTap content to Supabase |
| Step 4 (Payment) | Stripe Checkout with book_id & email |
| Step 5 (Webhook) | Stripe webhook → PDF, storage, email, Thank You page |

---

## ✅ Major Paths Summary

| Path | Payment Timing | Editing Allowed | PDF Generated From |
|------|----------------|-----------------|--------------------|
| Surprise Me | Before full book | ❌ No | AI-generated |
| Let Me Guide It | After editing | ✅ Yes | User-edited content |

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 14, React, MUI, TipTap
- **Backend**: Next.js API routes, Supabase
- **Payments**: Stripe
- **AI**: OpenAI GPT-4-turbo, DALL·E 3
- **PDF**: html-pdf-node
- **Email**: Resend
- **Monitoring**: Sentry
- **Analytics**: PostHog
- **CI/CD**: GitHub Actions → Vercel

---

## 🚀 Deployment Quick Guide

1️⃣ Clone repo  
2️⃣ Setup `.env.local` using provided `.env.local.example`  
3️⃣ Push to GitHub → connected to Vercel  
4️⃣ Set ENV vars in Vercel dashboard  
5️⃣ Stripe → Webhook to `/api/stripe-webhook`  
6️⃣ Supabase → Books table + Storage bucket  
7️⃣ Resend → Verified domain + API key  
8️⃣ Enjoy 🎉

---

## ⚙️ Required ENV Variables

See `.env.local.example` for all required variables. Example:

```env
NEXT_PUBLIC_SITE_URL=https://www.bonusplay.com
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=xxx
RESEND_API_KEY=re_xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
```

---

## 🛡 License

© 2025 Gamesoft Interactive Limited. This platform is developed by Gamesoft Interactive Limited and licensed for use by BonusTrade Interactive Limited. All rights reserved.

---

## 🙏 Credits

- Darren & Nick — Project vision & architecture  
- ChatGPT (GPT-4-turbo) — Assistant & collaborator 😉  
- OpenAI, Stripe, Supabase, Resend, Vercel, Sentry, PostHog

---
