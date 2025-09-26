/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers(){
    const headers = await import('./../packages/security/headers');
    const pairs = headers.securityHeaders();
    return [
      {
        source: '/(.*)',
        headers: pairs.map(([key, value])=> ({ key, value }))
      }
    ];
  }
};
module.exports = nextConfig;
