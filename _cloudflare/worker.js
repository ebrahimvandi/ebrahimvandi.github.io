// Cloudflare Worker for ebrahimvandi.com: serves the static site and sends every
// other address (www, http, the workers.dev preview) to https://ebrahimvandi.com.
const HOST = "ebrahimvandi.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname !== HOST || url.protocol !== "https:") {
      url.hostname = HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
