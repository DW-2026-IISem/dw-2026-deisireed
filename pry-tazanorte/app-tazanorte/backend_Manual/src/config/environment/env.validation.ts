import { Environment } from './env.interface';

export function validate(config: Record<string, any>): Environment {
  return config as unknown as Environment;
}
