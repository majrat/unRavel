/* eslint-disable no-undef */
import dotenv from "dotenv";

dotenv.config();
const { privateKey } = JSON.parse(process.env.PRIVATE_KEY);

export default {
  PEXELS_API: process.env.PEXELS_API,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_ATLAS_URI: process.env.MONGO_ATLAS_URI,
  TYPE: process.env.TYPE,
  PROJECT_ID: process.env.PROJECT_ID,
  PRIVATE_KEY_ID: process.env.PRIVATE_KEY_ID,
  PRIVATE_KEY: privateKey,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  CLIENT_ID: process.env.CLIENT_ID,
  AUTH_URI: process.env.AUTH_URI,
  TOKEN_URI: process.env.TOKEN_URI,
  AUTH_PROVIDER_X509_CERT_URL: process.env.AUTH_PROVIDER_X509_CERT_URL,
  CLIENT_X509_CERT_URL: process.env.CLIENT_X509_CERT_URL,
};
