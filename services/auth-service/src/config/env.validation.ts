import * as Joi from 'joi';
export const envValidationSchema = Joi.object({ NODE_ENV: Joi.string().valid('development','test','production').default('development'), PORT: Joi.number().default(3000), DATABASE_URL: Joi.string().uri().optional(), JWT_SECRET: Joi.string().min(16).optional(), CORS_ORIGIN: Joi.string().allow('*').default('*'), RATE_LIMIT_TTL: Joi.number().default(60), RATE_LIMIT_LIMIT: Joi.number().default(100)   ,
  METRICS_ENABLED: Joi.boolean().default(true)
  ,
  OTEL_ENABLED: Joi.boolean().default(false)
  ,
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string().uri().optional()
  ,
  OTEL_SERVICE_NAME: Joi.string().optional()
  ,
  PRISMA_SLOW_MS: Joi.number().default(300)
  ,
  PRISMA_LOG_QUERIES: Joi.boolean().default(false)
  ,
  DB_CONNECTION_LIMIT: Joi.number().default(10)
});
