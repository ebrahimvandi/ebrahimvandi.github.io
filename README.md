# ebrahimvandi.com

Personal website of **Alireza Ebrahimvandi, PhD** — Data Scientist at UCSF Health.
Live at **<https://ebrahimvandi.com/>**

Plain HTML/CSS with no build step, hosted on Cloudflare (free plan). The old address,
`ebrahimvandi.github.io`, forwards every page to the domain.

## Editing

- **Content:** everything lives in `index.html` (About, Work, Experience, Research, Skills, Contact).
- **Styles:** `assets/style.css`. **Behavior** (mobile menu, active nav link, scroll reveals, count-up figures): `assets/main.js`.
- **Charts** on the page are decorative inline SVG illustrations (no data); edit them in place in `index.html`.
- **Résumé PDF:** edit `_src/resume.html`, then rebuild `Alireza-Ebrahimvandi-Resume.pdf` (below). Keep it in step with `index.html`.
- **Social-share image:** edit `_src/og-image.html`, then rebuild `assets/og-image.png` (below).
- **After a content change,** bump `dateModified` in the JSON-LD block of `index.html`
  and `<lastmod>` in `sitemap.xml` so search engines re-crawl.
- **Then publish** (below).

## Publishing

From the repository root, after committing to `main`:

```powershell
npx wrangler deploy
```

This uploads the folder to the Cloudflare Worker `ebrahimvandi` (config in `wrangler.jsonc`), which serves
`ebrahimvandi.com`. The first run asks you to log in to Cloudflare in the browser. `.assetsignore` keeps
`_src/`, `_cloudflare/`, the README, and the deployment config off the website.
`_cloudflare/worker.js` sends `www`, `http://`, and any other address to `https://ebrahimvandi.com`.

## Rebuilding the PDF and share image

From the repository root in PowerShell, using the installed Chrome (nothing else to install):

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$common = "--headless", "--user-data-dir=$env:TEMP\chrome-headless", "--virtual-time-budget=10000"
Start-Process $chrome -Wait -ArgumentList ($common + "--no-pdf-header-footer", "--print-to-pdf=$PWD\Alireza-Ebrahimvandi-Resume.pdf", "$PWD\_src\resume.html")
Start-Process $chrome -Wait -ArgumentList ($common + "--hide-scrollbars", "--window-size=1200,630", "--screenshot=$PWD\assets\og-image.png", "$PWD\_src\og-image.html")
```

The PDF should stay at two pages.

## Domain

`ebrahimvandi.com` is registered at Cloudflare; keep auto-renew on so it doesn't lapse. `wrangler deploy`
manages the DNS records for `ebrahimvandi.com` and `www.ebrahimvandi.com` and their HTTPS certificates.

GitHub Pages still builds `main` at `ebrahimvandi.github.io`. Its custom domain is set to `ebrahimvandi.com`
(the `CNAME` file), so GitHub redirects old `github.io` links to the same page on the domain. Leave Pages on
and the `CNAME` file in place, or those old links stop working. GitHub will report that the domain's DNS
doesn't point at it; that's expected.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The site (single page) |
| `Alireza-Ebrahimvandi-Resume.pdf` | Two-page résumé, built from `_src/resume.html` |
| `_src/` | Sources for the PDF résumé and the social-share image, plus matching LinkedIn copy (not published) |
| `about.html`, `experience.html`, … | Redirects from the old multi-page URLs to the matching section |
| `404.html` | Not-found page |
| `wrangler.jsonc`, `.assetsignore`, `_cloudflare/` | Cloudflare hosting config, publish exclusions, and redirect Worker |
| `CNAME` | Makes GitHub Pages forward `ebrahimvandi.github.io` to the domain |
| `robots.txt`, `sitemap.xml` | Crawler instructions and sitemap |
| `d45cb716debc45d61e73653540e3335a.txt` | [IndexNow](https://www.indexnow.org/) key for Bing/Yandex re-crawl requests |
| `favicon.ico`, `assets/*.png` | Icons and the social-share preview image |
| `assets/fonts/` | Self-hosted Inter, Instrument Serif, and Geist Mono (SIL Open Font License) |
