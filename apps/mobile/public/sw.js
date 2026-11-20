// Deliberately do not cache authenticated screens, JavaScript bundles, or
// Supabase responses. This worker enables PWA lifecycle/install behavior while
// ensuring deployments and account data are always fetched fresh over HTTPS.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
