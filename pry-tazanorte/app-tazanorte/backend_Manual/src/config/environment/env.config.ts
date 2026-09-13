import { resolveDialectCredentials } from './db-env.js';
import { Environment } from './env.interface.js';
import { validate } from './env.validation.js';

export const envConfig = (): Environment => {
  return validate(process.env);
};
