// tools/env/validate.mjs
const required = [
  'NEXT_PUBLIC_API_BASE',
  'NEXT_PUBLIC_WS_URL',
  'NEXT_PUBLIC_FF_PAYMENTS_API',
  'NEXT_PUBLIC_PUSH_PUBLIC_KEY',
  'OTEL_EXPORTER_OTLP_ENDPOINT'
];
const missing = required.filter(k=> !process.env[k] || String(process.env[k]).trim()==='');
if(missing.length){
  console.error('Missing ENV keys:', missing.join(', '));
  process.exit(1);
}else{
  console.log('ENV looks good.');
}
