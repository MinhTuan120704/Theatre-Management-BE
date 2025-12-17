import Joi from "joi";

require("dotenv").config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRATION: Joi.string().default("15m"),
  JWT_REFRESH_EXPIRATION: Joi.string().default("7d"),
  JWT_RESET_PASSWORD_EXPIRATION: Joi.string().default("10m"),

  //Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(4000),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SSL_CA_PATH: Joi.string().required(),
}).unknown(true);

const { error, value: envVars } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION,
  },
  mysql: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    database: envVars.DB_DATABASE,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    ca: envVars.DB_SSL_CA_PATH,
  },
};

export default config;
