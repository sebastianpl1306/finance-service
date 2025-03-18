import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  CONNECTION_STRING: get('CONNECTION_STRING').required().asString(),
  SECRET_JWT: get('SECRET_JWT').required().asString()
}