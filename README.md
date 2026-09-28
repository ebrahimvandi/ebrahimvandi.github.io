# ebrahimvandi.github.io

Personal website of **Alireza Ebrahimvandi, PhD** — Data Scientist at UCSF Health.
Live at **https://ebrahimvandi.github.io/**

Plain HTML/CSS with no build step. GitHub Pages publishes the `main` branch automatically.

## Editing

- **Content:** everything lives in `index.html` (About, Experience, Research, Skills, Contact).
- **Styles:** `assets/style.css`. **Behavior** (mobile menu, active nav link, scroll reveals, count-up figures): `assets/main.js`.
- **Charts** on the page are decorative inline SVG illustrations (no data); edit them in place in `index.html`.
- **After a content change,** bump `dateModified` in the JSON-LD block of `index.html`
  and `<lastmod>` in `sitemap.xml` so search engines re-crawl.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The site (single page) |
| `about.html`, `experience.html`, … | Redirects from the old multi-page URLs to the matching section |
| `404.html` | Not-found page |
| `robots.txt`, `sitemap.xml` | Crawler instructions and sitemap |
| `d45cb716debc45d61e73653540e3335a.txt` | [IndexNow](https://www.indexnow.org/) key for Bing/Yandex re-crawl requests |
| `favicon.ico`, `assets/*.png` | Icons and the social-share preview image |
| `assets/fonts/` | Self-hosted Inter, Instrument Serif, and Geist Mono (SIL Open Font License) |
