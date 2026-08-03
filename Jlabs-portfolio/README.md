# Joshua Jatto — Portfolio Site

A fast, static personal portfolio built with plain HTML, Tailwind CSS (CDN), and vanilla JavaScript. No build step required.

## File structure

```
├── index.html          Main page (all content/markup)
├── css/
│   └── style.css        Custom CSS (Tailwind handles the utility classes)
├── js/
│   └── main.js           All page interactivity (nav, carousels, live clock, etc.)
├── assets/
│   ├── logo-white.png         Logo (white), used in the dark nav bar + footer
│   ├── jlabs-logo.png         Logo (full color), kept for use on light backgrounds
│   ├── favicon.png            Browser tab icon
│   ├── photo.jpg               About section photo
│   └── photo-placeholder.svg  Spare placeholder graphic (not currently linked)
└── README.md
```

## Running locally

No build tools needed — it's a static site. Two options:

1. **Just open it**: double-click `index.html` to open it directly in a browser.
2. **Local server** (recommended, avoids some browser file:// quirks):
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:3000` or `http://localhost:8000`.

## Current site status

- ✅ Real photo, name, and logo in place
- ✅ Contact section points visitors to your real LinkedIn and GitHub — no contact form or public email address on the page
- ✅ A "Site under construction" notice with a live clock sits at the bottom of the footer
- ⚠️ Project cards have no GitHub/demo links right now (removed on request) — add them back in per-project once repos are public
- ⚠️ The "Live Demo" link on the AI Resume Automation Platform project is still a placeholder (`href="#"`) — point it somewhere real or remove it

### Removing the "under construction" notice
In `index.html`, find `<div id="constructionBanner">...</div>` near the end of the `<footer>` and delete that block (and the `js/main.js` live-clock code tied to `#liveClock`, if you want to fully clean it up — it's harmless to leave either way since it just won't render).

### Re-adding a contact method
If you'd like an email address, contact form, or additional social link back on the site, just ask — the Contact section is currently built around the LinkedIn/GitHub cards only.

## Deployment

Any static host works since there's no server/build step:

- **Netlify**: drag-and-drop this folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel**: `npx vercel` from this folder, or import the folder in the Vercel dashboard
- **GitHub Pages**: push this folder to a repo, enable Pages in repo settings (Settings → Pages → deploy from branch)

Once deployed, update `<link rel="canonical" href="...">` and the Open Graph/Twitter meta tags near the top of `index.html` with your real domain.

## Stack

- Tailwind CSS (Play CDN)
- AOS — scroll animations
- Swiper.js — certifications & testimonials carousels
- Lucide — icons
- particles.js — subtle animated hero background

All loaded via CDN — no `npm install` required.
