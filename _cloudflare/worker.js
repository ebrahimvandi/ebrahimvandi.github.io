// Cloudflare Worker for ebrahimvandi.com: serves the static site with security and
// caching headers, and sends every other address (www, http, the workers.dev preview)
// to https://ebrahimvandi.com.
const HOST = "ebrahimvandi.com";

// Old multi-page URLs, now sections of the homepage.
const MOVED = { about: "about", experience: "experience", research: "research", skills: "skills", contact: "contact" };

// Inline <script> blocks allowed to run, by SHA-256 hash. If you edit one, update its hash:
// the browser console prints the expected value when a script is blocked.
const SCRIPT_HASHES = [
  "sha256-WZRJfWvsnNCPcxzZwvyhovnZGqhZaC+8gPGPRbx6wTk=", // index.html: adds the "js" class
  "sha256-/gJy7NI1eMg3PgusAF6CTn0C9/TqPELhw2SIsaiWMl8=", // about.html redirect
  "sha256-HPYmNTblKyrnSAAZuV5a+her4Epcl0PQEwEazbIaLzQ=", // contact.html redirect
  "sha256-5LXQxcTSDTWOMCGKn8sbWTJgF6ILs9WG3xPbd6wexqI=", // experience.html redirect
  "sha256-ZnGyGbLAQtoiwsWX4XKOV9Dqm3T2tYZNGr3NkUl01gA=", // research.html redirect
  "sha256-I+OVqtbPUxsfJ+F+ec0XL4KIitecTA3ot80msFV4NmM=", // skills.html redirect
];

const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    // Cloudflare Web Analytics injects its beacon from static.cloudflareinsights.com.
    `script-src 'self' https://static.cloudflareinsights.com ${SCRIPT_HASHES.map((h) => `'${h}'`).join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

function cacheControl(path) {
  if (path.startsWith("/assets/fonts/")) return "public, max-age=31536000, immutable";
  if (/\.(png|ico|pdf)$/.test(path)) return "public, max-age=86400";
  if (/\.(css|js)$/.test(path)) return "public, max-age=3600";
  return "public, max-age=0, must-revalidate";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname !== HOST || url.protocol !== "https:") {
      url.hostname = HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    const old = url.pathname.match(/^\/(\w+)(?:\.html)?\/?$/);
    if (old && MOVED[old[1]]) return Response.redirect(`https://${HOST}/#${MOVED[old[1]]}`, 301);

    const asset = await env.ASSETS.fetch(request);
    const response = new Response(asset.body, asset);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
    if (asset.ok) response.headers.set("Cache-Control", cacheControl(url.pathname));
    // Plain-text copies for AI agents (llms.txt, resume.md) declare UTF-8 so accents survive.
    if (asset.ok && url.pathname.endsWith(".md")) response.headers.set("Content-Type", "text/markdown; charset=utf-8");
    else if (asset.ok && url.pathname.endsWith(".txt")) response.headers.set("Content-Type", "text/plain; charset=utf-8");
    return response;
  },
};
