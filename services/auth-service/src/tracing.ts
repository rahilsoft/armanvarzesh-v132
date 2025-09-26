import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
let sdk: NodeSDK | null = null;
export async function startTracing(){ if(String(process.env.OTEL_ENABLED||'false')!=='true') return; const exporter=new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces' }); sdk=new NodeSDK({ traceExporter: exporter, instrumentations:[getNodeAutoInstrumentations()], serviceName: process.env.OTEL_SERVICE_NAME || process.env.npm_package_name || 'armanfit-service' }); await sdk.start(); console.log(JSON.stringify({ level:'info', msg:'otel-started', endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT })); }
export async function stopTracing(){ if(!sdk) return; await sdk.shutdown(); sdk=null; }
