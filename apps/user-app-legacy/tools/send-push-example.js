// Phase A′ — Sample push sender via Expo Push API
// Usage: node tools/send-push-example.js <expoPushToken> "Hello" "Body text"
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const [,, token, title='Hello', body='Test from script'] = process.argv;

if (!token) {
  console.error('Usage: node tools/send-push-example.js <expoPushToken> [title] [body]');
  process.exit(1);
}

(async () => {
  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: token,
      title,
      body,
      data: { ts: Date.now() }
    })
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
})().catch(err => (console.error(err), process.exit(1)));
