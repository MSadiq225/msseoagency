# msseoagency — MS SEO Agency Outreach Tool

Premium multi-user guest-posting outreach tool: All Clients board, parallel sender lanes (Gmail + Hostinger), Casino Top 50 prospects embedded, zero-placeholder templates, Campaign + Build Queue, URL Checker (honest Verified/Unverified), WhatsApp status.

> **UNIVERSAL — kisi ek client ke liye nahi.** Ye tool agency ke **purane, naye aur future sab clients** aur sara kaam karne ke liye hai. Macfox, Boss MF/ELEGOO, Casino, Qiolor aur Black Friday sirf **presets/examples** hain — unhe edit/delete nahi kar sakte. Koi bhi naya client "+ Naya Client" form se add karo: naam, niche, rules, sender, template — wo client phir Clients board, pipeline, Prospects, Templates, Campaign/Queue aur URL Checker mein built-in clients ki tarah kaam karega.

> **No live URL exists yet. No `msseoagency.vercel.app` address exists until Sadiq deploys it himself from his own Vercel account (foundermsseoagency@gmail.com).** Do not share any link as the live site until deployment finishes.

## Naya client kaise add karein (Roman Urdu)

1. Tool kholo → **All Clients** tab → upar **+ Naya Client** form.
2. **Client ka naam** likho (zaroori) — niche likho ya suggestion choose karo (e-bikes, tech/3D printing, casino/iGaming, e-commerce, health, finance, travel, SaaS, fashion, food, education — suggestion hai, zabardasti nahi; koi bhi niche likh sakte ho).
3. **Sender** likho: naam, title, aur is client ke liye kaunsi email ID se mail jayegi.
4. **Requirements:** har line pe ek rule (free form, e.g. "US/UK audience", "No gambling content") — plus optional: min traffic, min Authority Score, price cap, aur Dofollow / Permanent / No upfront checkboxes.
5. **Template (optional):** subject + body + Day-3 follow-up likho. Khaali chhodo to tool khud generic template bana lega — zero-placeholder, no budget/link/attachment. Apna template likho to wahi use hoga.
6. **Save client** dabao — client ab har jagah dikhega:
   - **Clients board + pipeline** (New → Queued → Sent → Replied → Price received → Order confirmed)
   - **Prospects:** client filter mein select karo, uske prospects add karo
   - **Templates:** client select karo, uska template copy karo
   - **Campaign & Queue:** client select karo → Build Queue dabao, queue mein usi client ka template lagta hai
   - **URL Checker:** client select karo — checklist usi client ki rules se banti hai
7. Apna banaya hua client **Delete** bhi kar sakte ho (uske card pe button hai) — presets delete nahi hote.

Client ka data sirf **is browser** mein save hota hai (localStorage). Naye browser/device pe dobara add karna parega jab tak backend + database na ho (neeche dekho).

## Deploy steps (free)

### 1) Push this folder to GitHub
1. github.com/SadiqArshad → New repository → name `msseoagency` → Create (Public or Private — your choice). Vercel account: foundermsseoagency@gmail.com; GitHub username: SadiqArshad.
2. Is folder ke saare files upload karo (GitHub web par "uploading an existing file" se, ya `git push` se). Repo hoga: github.com/SadiqArshad/msseoagency
3. **Kabhi password ya API key repo mein mat daalo.**

### 2) Vercel → New Project → Deploy (front-end)
1. vercel.com → log in with **foundermsseoagency@gmail.com** → **Add New → Project**.
2. **Import** apna `msseoagency` GitHub repo.
3. Project Name: `msseoagency` → **Deploy** dabao.
4. Deploy hone ke baad Vercel aapko link dega (agar `msseoagency` pehle se liya hua ho to Vercel khud thoda farq wala naam de dega).
5. Bas — ye link new tab mein khulta hai, students ko wahi link de do.

> Front-end akela sirf browser mein chalta hai (localStorage, per browser). Is se mail **khud nahi jayegi** — Queue manual only rahegi.

### 3) Backend on Render free (agar auto-send chahiye)
Live auto-send ke liye backend chahiye — Vercel front-end ke liye nahi, Render free web service ke liye:

1. render.com → New → **Web Service** → apna `msseoagency` GitHub repo connect karo.
2. Build Command: `npm install` · Start Command: `npm start`.
3. Environment variables (Render → Environment) — **yeh kabhi chat ya repo mein mat likho**:
   - `SMTP_HOST` — Gmail ke liye `smtp.gmail.com`, Hostinger ke liye `mail.msseoagency.com`
   - `SMTP_PORT` — `587`
   - `SMTP_USER` — e.g. `foundermsseoagency@gmail.com`
   - `SMTP_APP_PASSWORD` — Gmail App Password (normal Gmail password **nahi** — Google Account → Security → 2-Step Verification → App passwords) ya Hostinger mailbox password
   - `SMTP_FROM` — e.g. `Aqib Ali <foundermsseoagency@gmail.com>`
4. Deploy ke baad Render URL milega, e.g. `https://msseoagency.onrender.com`.
5. Tool kholo → **Settings → Backend URL** mein wo URL paste karo → **Check backend** dabao. SMTP ready dikhe to Queue mein **Send via backend** kaam karega.
6. Ek deployment = ek SMTP mailbox. 50+ sender IDs ke liye har mailbox ka alag Render service chahiye, ya queue runner jo har lane ke liye SMTP_USER badle.

## Roman Urdu — mukhtasar
1. Is folder ko GitHub par daalo.
2. Vercel → New Project → repo import karo → naam `msseoagency` → Deploy.
3. Auto-send chahiye to Render free par backend lagao (upar env vars dekho), phir tool ki Settings mein backend URL daalo.
4. Password kabhi chat mein mat bhejo — sirf Vercel/Render ke env vars mein daalo.

## What works without backend
Admin + students add karna, senders add karna (parallel lanes dikhengi), **kisi bhi client ko add karna** (All Clients board, pipeline, Prospects, Templates, Campaign, URL Checker — sab per client), Casino Top 50 dekhna, templates copy karna, Build Queue banana, Mark Sent / Mark Replied, URL Checker ka honest message (selected client ki rules ki checklist, sab Unverified unless evidence/API key).

## What needs the backend
Live auto-send, shared logins across devices, server-side Sent confirmation.

## Files
- `index.html`, `app.js`, `style.css` — front-end (no build step)
- `server.js` — optional Node backend (`POST /api/send`, SMTP only from env vars)
- `package.json`, `vercel.json`
- `DEPLOY-STATUS.md` — exactly what works, what does not, and what is missing
