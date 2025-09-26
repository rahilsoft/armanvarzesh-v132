import { Resource } from '@opentelemetry/resources';
export function buildResource() {
  const serviceName = process.env.SERVICE_NAME || 'arman-backend';
  const serviceVersion = process.env.SERVICE_VERSION || '0.0.0';
  const deploymentEnv = process.env.SERVICE_ENV || process.env.NODE_ENV || 'development';
  return new Resource({
    'service.name': serviceName,
    'service.version': serviceVersion,
    'deployment.environment': deploymentEnv,
  });
}
