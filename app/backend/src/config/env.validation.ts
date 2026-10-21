import * as Joi from 'joi';

const devOrTest = Joi.string().required().valid('development', 'test');

/** envValidationSchema
 *  Validates critical environment variables for backend configuration.
 *  'staging' is production-strict: secrets are required unless NODE_ENV is
 *  exactly 'development' or 'test'. An unset NODE_ENV is treated as strict too.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'staging', 'production'),
  PORT: Joi.number().integer().min(0).default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().allow('', null),
  JWT_SECRET: Joi.string().min(32).required(),
  REFRESH_JWT_SECRET: Joi.string().min(32),
  ADMIN_JWT_SECRET: Joi.string().min(32),
  JWT_ACCESS_SECRET: Joi.string().min(32),
  CERT_SECRET: Joi.string()
    .min(32)
    .when('NODE_ENV', { is: devOrTest, then: Joi.optional(), otherwise: Joi.required() }),
  JWT_ISSUER: Joi.string().default('armanfit'),
  JWT_AUDIENCE: Joi.string().default('armanfit-users'),
  ENABLE_GRAPHQL_INTROSPECTION: Joi.boolean().truthy('true').falsy('false').default(false),
  ENABLE_GRAPHQL_PLAYGROUND: Joi.boolean().truthy('true').falsy('false').default(false),
  GRAPHQL_DEPTH_LIMIT: Joi.number().integer().min(1).max(20).default(8),
  RATE_LIMIT_TTL: Joi.number().integer().min(1).default(60),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
  // Payments: PAYMENT_PROVIDER/ZARINPAL_* are enforced at PaymentsModule init
  // (assertPaymentProviderConfigured), BOOKING_WEBHOOK_SECRET fail-closed per request.
  PAYMENT_PROVIDER: Joi.string().valid('zarinpal', 'mock').allow(''),
  ZARINPAL_MERCHANT_ID: Joi.string().allow(''),
  ZARINPAL_CALLBACK_URL: Joi.string().uri().allow(''),
  ZARINPAL_SANDBOX: Joi.string().valid('true', 'false').allow(''),
  BOOKING_WEBHOOK_SECRET: Joi.string().min(32).allow(''),
}).unknown(false);