import { v2 as cloudinary } from "cloudinary";
import config from "../config/index.mjs";

const cloud_name = config.CLOUD_NAME;
const api_key = config.API_KEY;
const api_secret = config.API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export default (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result.secure_url);
      } else if (error) {
        return reject({ message: error.message });
      }
    });
  });
};
