export function csp(): string{
  // NOTE: to avoid breaking inline styles from legacy code, 'unsafe-inline' is temporarily allowed for style.
  // Tighten this with nonces/hashes when feasible.
  const self = "'self'";
  return [
    `default-src ${self}`,
    `script-src ${self} 'unsafe-inline'`,
    `style-src ${self} 'unsafe-inline'`,
    `img-src ${self} data: blob:`,
    `font-src ${self} data:`,
    `connect-src ${self} https: http:`,
    `frame-ancestors ${self}`,
    `base-uri ${self}`,
    `form-action ${self}`
  ].join('; ');
}

export function securityHeaders(){
  const headers: [string, string][] = [
    ['Content-Security-Policy', csp()],
    ['X-Content-Type-Options', 'nosniff'],
    ['X-Frame-Options', 'SAMEORIGIN'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ];

  // Enable HSTS in production (NODE_ENV=production and ENABLE_HSTS=1)
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_HSTS !== '0') {
    headers.push(['Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload']);
  }

  return headers;
}
