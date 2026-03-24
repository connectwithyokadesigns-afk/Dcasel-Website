# Dcasel — Design Studio Website

Static website for Dcasel design studio. No build step required.

## Pages
- `index.html` — Homepage
- `about.html` — About the studio
- `work.html` — Portfolio / Work overview
- `case-study-post.html` — Case study detail
- `brand-identity.html` — Brand Identity service page
- `web-design.html` — Web Design service page
- `product-design.html` — Product Design service page
- `motion-design.html` — Motion Design service page
- `creative-direction.html` — Creative Direction service page
- `process.html` — Design process page
- `why-dcasel.html` — Why Dcasel page

## Assets
All CSS and JS lives in `assets/`:
- `cursor.css` / `cursor.js` — Custom planet cursor system
- `mobile.css` — Mobile / responsive styles
- `site.js` — Shared site utilities
- `index-logic.js` — Homepage interactions
- `subpage-logic.js` — Subpage interactions
- `work-logic.js` — Work/portfolio page interactions
- `cs-overlay.js` — Case study overlay / lightbox

## Deployment

### GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set source to `main` branch, `/ (root)` folder.
4. Save — your site will be live at `https://<username>.github.io/<repo>/`.

### Netlify (drag & drop)
Drop this folder onto [netlify.com/drop](https://app.netlify.com/drop) for instant deployment.

### Netlify (Git)
1. Push to GitHub.
2. In Netlify, click **Add new site → Import an existing project**.
3. Connect your repo. No build command needed, publish directory is `/` (root).

### Vercel
1. Push to GitHub.
2. Import the repo in Vercel. Leave build command empty, output directory `.` (root).
