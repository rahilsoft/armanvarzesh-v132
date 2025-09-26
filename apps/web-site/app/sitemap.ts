
export default function sitemap(){
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: base + '/', changefreq: 'weekly', priority: 1.0 },
    { url: base + '/admin/login', changefreq: 'yearly', priority: 0.2 }
  ];
}
