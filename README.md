# ChobiClear 🖼✨ — Free Background Remover

**ChobiClear** (ছবি + Clear) is a bilingual AI-powered background remover built for Bangladesh.
Remove photo backgrounds instantly — free, no signup required.

🔗 **Live App**: [chobiclear.com](https://chobiclear.com)  
🤗 **API (Hugging Face)**: [rudro1/chobiclear-api](https://huggingface.co/spaces/rudro1/chobiclear-api)

---

## ✨ Features

- ⚡ **Instant AI background removal** — U²-Net deep learning, zero per-call cost
- 🇧🇩 **Bilingual** — English + Bengali (ছবি থেকে ব্যাকগ্রাউন্ড সরানো)
- 🔒 **Privacy-first** — files auto-deleted after 60 minutes
- 🆓 **Free tier** — 10 images/day, watermarked PNG
- 💳 **Paid plans** — HD clean downloads via bKash, Nagad, Rocket, card
- 📈 **SEO optimized** — JSON-LD schema, sitemap, canonical, OG tags

---

## 🏗 Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TypeScript, Vanilla CSS |
| Backend | FastAPI, Python 3.11 |
| AI Model | `rembg` (U²-Net) |
| Auth | JWT (PyJWT) |
| Payments | SSLCommerz (bKash/Nagad/Rocket/card) |
| Frontend Hosting | Vercel |
| Backend Hosting | Hugging Face Spaces (Docker) |

---

## 📁 Structure

```
chobiclear/
├── frontend/              # Next.js app → deploy to Vercel
│   ├── app/
│   │   ├── layout.tsx     # SEO: JSON-LD, OG tags, canonical
│   │   ├── page.tsx       # Landing page
│   │   ├── globals.css    # Design system
│   │   ├── sitemap.ts     # Dynamic sitemap
│   │   └── robots.ts      # Robots rules
│   └── components/
│       ├── Navbar.tsx
│       ├── Uploader.tsx       # Drag-and-drop, 10 MB limit
│       ├── ResultView.tsx     # Checkerboard preview + downloads
│       ├── PricingSection.tsx # 3 plan tiers
│       └── FAQSection.tsx     # Bilingual accordion FAQ
└── backend/               # FastAPI API → deploy to HF Spaces
    ├── main.py            # Routes: /remove-bg, /download, /payment
    ├── Dockerfile         # HF Spaces Docker config (port 7860)
    ├── requirements.txt
    └── services/
        ├── bg_remover.py  # rembg wrapper
        ├── watermark.py   # Free-tier watermark
        ├── storage.py     # Temp file + auto-cleanup
        ├── auth.py        # JWT auth
        └── payment.py     # SSLCommerz integration
```

---

## 🚀 Local Development

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in your values
uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs
```

> First run downloads the U²-Net model (~170 MB) automatically.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
# → http://localhost:3000
```

---

## ☁️ Deployment

### Frontend → Vercel

1. Import this repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend/`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://rudro1-chobiclear-api.hf.space
   ```
4. Deploy ✅

### Backend → Hugging Face Spaces

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. Name it `chobiclear-api`, select **Docker** SDK
3. Push the `backend/` folder contents (the `README.md` with YAML front-matter is already configured)
4. Add **Secrets** in Space settings:
   ```
   JWT_SECRET=<long random string>
   SSLCOMMERZ_STORE_ID=<your store id>
   SSLCOMMERZ_STORE_PASS=<your store password>
   ALLOWED_ORIGINS=https://chobiclear.com,https://chobiclear.vercel.app
   ```
5. The Space builds automatically — API live at `https://rudro1-chobiclear-api.hf.space` ✅

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `JWT_SECRET` | Long random string for JWT signing |
| `FILE_EXPIRY_MINUTES` | Auto-delete interval (default: 60) |
| `FREE_RATE_LIMIT_PER_DAY` | Max free requests per IP/day (default: 10) |
| `SSLCOMMERZ_STORE_ID` | SSLCommerz merchant store ID |
| `SSLCOMMERZ_STORE_PASS` | SSLCommerz merchant password |
| `SSLCOMMERZ_SANDBOX` | `True` for sandbox, `False` for production |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. HF Spaces URL) |

---

## 💳 SSLCommerz Setup

1. Register at [developer.sslcommerz.com](https://developer.sslcommerz.com)
2. Get sandbox credentials from the merchant dashboard
3. Set `SSLCOMMERZ_SANDBOX=True` during dev, `False` for production
4. Set IPN URL in SSLCommerz dashboard → `https://your-api.hf.space/payment/ipn`

---

## 📄 License

MIT
