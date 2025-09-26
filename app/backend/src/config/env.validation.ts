import * as Joi from 'joi';

/** envValidationSchema
 *  Validates critical environment variables for backend configuration.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','test','production').default('development'),
  PORT: Joi.number().integer().min(0).default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().allow('', null),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_ISSUER: Joi.string().default('armanfit'),
  JWT_AUDIENCE: Joi.string().default('armanfit-users'),
  ENABLE_GRAPHQL_INTROSPECTION: Joi.boolean().truthy('true').falsy('false').default(false),
  ENABLE_GRAPHQL_PLAYGROUND: Joi.boolean().truthy('true').falsy('false').default(false),
  GRAPHQL_DEPTH_LIMIT: Joi.number().integer().min(1).max(20).default(8),
  RATE_LIMIT_TTL: Joi.number().integer().min(1).default(60),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
}).unknown(false);