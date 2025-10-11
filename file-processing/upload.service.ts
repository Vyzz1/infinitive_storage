import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
export class UploadService {
  constructor() {
    console.log(process.env.CLOUD_NAME);
    console.log(process.env.API_KEY);
    console.log(process.env.API_SECRET);
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async uploadBufferToCloudinary(buffer: Buffer, options: object) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }
}
