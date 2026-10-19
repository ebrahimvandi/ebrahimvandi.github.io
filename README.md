# ebrahimvandi.com

Personal website of **Alireza Ebrahimvandi, PhD** — Data Scientist at UCSF Health.
Live at **https://ebrahimvandi.com/**

Plain HTML/CSS with no build step. GitHub Pages publishes the `main` branch automatically.
The old address, `ebrahimvandi.github.io`, redirects to the domain.

## Editing

- **Content:** everything lives in `index.html` (About, Work, Experience, Research, Skills, Contact).
- **Styles:** `assets/style.css`. **Behavior** (mobile menu, active nav link, scroll reveals, count-up figures): `assets/main.js`.
- **Charts** on the page are decorative inline SVG illustrations (no data); edit them in place in `index.html`.
- **Résumé PDF:** edit `_src/resume.html`, then rebuild `Alireza-Ebrahimvandi-Resume.pdf` (below). Keep it in step with `index.html`.
- **Social-share image:** edit `_src/og-image.html`, then rebuild `assets/og-image.png` (below).
- **After a content change,** bump `dateModified` in the JSON-LD block of `index.html`
  and `<lastmod>` in `sitemap.xml` so search engines re-crawl.

## Rebuilding the PDF and share image

From the repository root in PowerShell, using the installed Chrome (nothing else to install):

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$common = "--headless", "--user-data-dir=$env:TEMP\chrome-headless", "--virtual-time-budget=10000"
Start-Process $chrome -Wait -ArgumentList ($common + "--no-pdf-header-footer", "--print-to-pdf=$PWD\Alireza-Ebrahimvandi-Resume.pdf", "$PWD\_src\resume.html")
Start-Process $chrome -Wait -ArgumentList ($common + "--hide-scrollbars", "--window-size=1200,630", "--screenshot=$PWD\assets\og-image.png", "$PWD\_src\og-image.html")
```

The PDF should stay at two pages. GitHub Pages doesn't publish folders that start with `_`, so `_src/` never appears on the website.

## Domain

`ebrahimvandi.com` is registered at Cloudflare. The `CNAME` file tells GitHub Pages to serve the site there,
and Cloudflare's DNS points the domain at GitHub Pages:

| Name | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www` | CNAME | `ebrahimvandi.github.io` (GitHub redirects `www` to the bare domain) |
| `@` | TXT | `v=spf1 -all` (the domain sends no email; this and the DMARC record stop others faking it) |
| `_dmarc` | TXT | `v=DMARC1; p=reject;` |
| `_github-pages-challenge-ebrahimvandi` | TXT | Verification code from GitHub → Settings → Pages (protects the domain from takeover) |

Keep every record **DNS only** (grey cloud), not proxied: GitHub Pages issues the HTTPS certificate,
and it can't while Cloudflare's proxy is on. Keep auto-renew on in Cloudflare so the domain doesn't lapse.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The site (single page) |
| `Alireza-Ebrahimvandi-Resume.pdf` | Two-page résumé, built from `_src/resume.html` |
| `_src/` | Sources for the PDF résumé and the social-share image, plus matching LinkedIn copy (not published) |
| `about.html`, `experience.html`, … | Redirects from the old multi-page URLs to the matching section |
| `404.html` | Not-found page |
| `CNAME` | The custom domain, for GitHub Pages |
| `robots.txt`, `sitemap.xml` | Crawler instructions and sitemap |
| `d45cb716debc45d61e73653540e3335a.txt` | [IndexNow](https://www.indexnow.org/) key for Bing/Yandex re-crawl requests |
| `favicon.ico`, `assets/*.png` | Icons and the social-share preview image |
| `assets/fonts/` | Self-hosted Inter, Instrument Serif, and Geist Mono (SIL Open Font License) |
