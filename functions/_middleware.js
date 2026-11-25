// Move ficwrapped.pages.dev to ficwrapped.yansquared.com with a permanent redirect.
// Preview deployments (<hash>.ficwrapped.pages.dev) are left alone, and so are the
// search-engine verification files, so the old property stays verified for Change of Address.
const NEW_ORIGIN = "https://ficwrapped.yansquared.com";
const KEEP = new Set(["/google55a4e1cc27afffdf.html", "/11392858012e47838d37df55a5852e11.txt", "/BingSiteAuth.xml"]);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === "ficwrapped.pages.dev" && !KEEP.has(url.pathname) && (request.method === "GET" || request.method === "HEAD")) {
    return new Response(null, { status: 301, headers: { Location: NEW_ORIGIN + url.pathname + url.search, "Cache-Control": "public, max-age=86400" } });
  }
  return next();
}
