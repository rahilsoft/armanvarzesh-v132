// public/sw.js — mock push handler
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title:'Mock', body:'Hello' };
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body }));
});
