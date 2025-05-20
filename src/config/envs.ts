import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  CONNECTION_STRING: get('CONNECTION_STRING').required().asString(),
  SECRET_JWT: get('SECRET_JWT').required().asString(),
  STRIPE_SECRET_KEY: get('STRIPE_SECRET_KEY').required().asString(),
  STRIPE_WEBHOOK_SECRET: get('STRIPE_WEBHOOK_SECRET').required().asString(),
  FRONT_DOMAIN: get('FRONT_DOMAIN').required().asString()
}