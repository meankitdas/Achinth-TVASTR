# TVASTR — Industrial Intelligence, Forged.

A premium single-page product website for **Tvastr** — an industrial AI company inspired by the Vedic artisan deity Tvāṣṭṛ. Built with React, Vite, TailwindCSS, and Three.js.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | TailwindCSS 3 |
| 3D Graphics | Three.js + React Three Fiber + Drei |
| Routing | React Router v6 |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx            — Fixed top navigation bar
│   ├── HeroSection.jsx       — Cinematic hero with Three.js forge core
│   ├── AboutSection.jsx      — Company philosophy + yantra divider
│   ├── ProductSlider.jsx     — Horizontal snap slider (drag/touch/click)
│   ├── ProductCard.jsx       — 3D tilt product cards with animated visuals
│   ├── TechnologyPhilosophy.jsx — Engineering principles section
│   ├── ContactSection.jsx    — Minimal contact footer
│   └── ProtectedRoute.jsx    — Auth guard for portal routes
├── pages/
│   ├── PortalLogin.jsx       — Customer portal login page (/portal)
│   └── PortalDashboard.jsx   — Protected download dashboard (/portal/dashboard)
├── three/
│   ├── ForgeCore.jsx         — Rotating metallic icosahedron with forge lighting
│   └── FloatingGeometry.jsx  — Ambient floating geometric particles
├── hooks/
│   └── useScrollReveal.js    — IntersectionObserver scroll animation hook
├── context/
│   └── AuthContext.jsx       — Supabase auth state + signIn/signOut actions
├── lib/
│   └── supabase.js           — Supabase client initialization
├── App.jsx                   — Router + layout root
├── main.jsx                  — React entry point
└── index.css                 — Tailwind + global styles
```

---

## Running Locally

### 1. Prerequisites

- Node.js 18+
- npm 9+

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials (see **Supabase Setup** below).

> The site works without Supabase credentials — the main landing page renders fully. Only the Customer Portal login/dashboard requires valid Supabase config.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production

```bash
npm run build
npm run preview   # preview production build locally
```

---

## Supabase Setup

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **Anon Key** from: Settings → API

### Step 2 — Configure .env

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Step 3 — Create customer users (manually)

Users are created manually via the Supabase dashboard:

1. Supabase Dashboard → Authentication → Users
2. Click **"Add user"** → Invite user (or create directly)
3. Set email + password for each customer

> No self-registration is exposed on the site. Only pre-created users can log in.

### Step 4 — Create the Storage bucket for downloads

1. Supabase Dashboard → Storage → New Bucket
2. Name it: `updates`
3. Set to **Private** (not public)
4. Upload your installer packages into subfolders:
   ```
   updates/
   ├── rejection-analysis/
   │   └── RAS_v1.3.0_installer.zip
   └── plant-intelligence/
       └── PI_v1.0.2_installer.zip
   ```

### Step 5 — Set Storage RLS policy

In Supabase Dashboard → Storage → Policies → `updates` bucket, add a policy:

```sql
-- Allow authenticated users to download any file from the updates bucket
CREATE POLICY "Authenticated downloads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'updates');
```

---

## Adding New Update Packages

1. Upload the ZIP file to Supabase Storage under the `updates` bucket
2. Open `src/pages/PortalDashboard.jsx`
3. Add a new entry to the `UPDATE_PACKAGES` array:

```js
{
  id: 3,
  product: 'Your Product Name',
  tag: 'Tag',
  version: 'v2.0.0',
  releaseDate: '2025-06-01',
  description: 'Short description of this release.',
  size: '~35 MB',
  storagePath: 'your-product/YP_v2.0.0_installer.zip',
  changelog: ['Change 1', 'Change 2'],
}
```

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel and set environment variables in:
**Vercel Dashboard → Project → Settings → Environment Variables**

```
VITE_SUPABASE_URL        = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY   = your-anon-key
```

Add a `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

1. Connect repo or drag-and-drop the `dist/` folder
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in: **Site Settings → Environment Variables**

The included `_redirects` file (or add one to `public/`):

```
/*  /index.html  200
```

---

## Design System

| Token | Value |
|---|---|
| Background | `#0a0a0b` (charcoal-950) |
| Surface | `#111113` (charcoal-900) |
| Text primary | `#e8e8ec` (metallic-100) |
| Text muted | `#888896` (metallic-400) |
| Accent | `#f59e0b` (amber-forge) |
| Accent bright | `#fbbf24` (amber-glow) |
| Font | Inter (Google Fonts) |

---

## License

Private. All rights reserved. © 2026 Tvastr.
