import Joi from '@hapi/joi';
import { MonitorConfig } from 'config';

const envVarsSchema = Joi.object({
  MONITOR_ENABLE: Joi.boolean().default(true),
  MONITOR_PORT: Joi.number().default(7777)
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const monitor: MonitorConfig = {
  enable: envVars.MONITOR_ENABLE,
  port: envVars.MONITOR_PORT
};

export { monitor };
