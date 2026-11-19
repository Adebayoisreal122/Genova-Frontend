# Genova frontend

Next.js 15 (App Router) + Tailwind 4.

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

Deploy to Vercel and add `NEXT_PUBLIC_API_URL` (your backend URL, no trailing slash) under
Project Settings → Environment Variables. There are no secrets in the frontend: remove.bg now runs on the backend.
