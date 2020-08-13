import Joi from '@hapi/joi';
import { CommonConfig } from 'config';

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'staging', 'test').default('development')
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const common: CommonConfig = {
  nodeEnv: envVars.NODE_ENV
};

export { common };
