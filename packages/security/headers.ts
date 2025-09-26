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
  return [
    ['Content-Security-Policy', csp()],
    ['X-Content-Type-Options', 'nosniff'],
    ['X-Frame-Options', 'SAMEORIGIN'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
    // Enable HSTS only if behind HTTPS in production
    // ['Strict-Transport-Security','max-age=31536000; includeSubDomains; preload']
  ];
}
