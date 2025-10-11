import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

export class CloudmersiveService {
  async cloudmersiveConvertToPdf(
    buffer: Buffer,
    originalName: string
  ): Promise<Buffer> {
    const tmpPath = path.join(os.tmpdir(), `${randomUUID()}-${originalName}`);
    fs.writeFileSync(tmpPath, buffer);

    const form = new FormData();
    form.append("inputFile", fs.createReadStream(tmpPath));

    try {
      const res = await axios.post(
        "https://api.cloudmersive.com/convert/autodetect/to/pdf",
        form,
        {
          headers: {
            ...form.getHeaders(),
            Apikey: process.env.CLOUDMERSIVE_API_KEY || "",
          },
          responseType: "arraybuffer",
        }
      );
      console.log("Converted document to PDF using Cloudmersive");
      fs.unlinkSync(tmpPath);
      return Buffer.from(res.data);
    } catch (error: any) {
      console.error(error?.response?.data || error.message);
      throw error;
    }
  }

  async cloudmersivePdfToThumbnail(buffer: Buffer): Promise<Buffer> {
    const tmpPath = path.join(os.tmpdir(), `${randomUUID()}.pdf`);
    fs.writeFileSync(tmpPath, buffer);

    const form = new FormData();
    form.append("inputFile", fs.createReadStream(tmpPath));

    const res = await axios.post(
      "https://api.cloudmersive.com/convert/autodetect/to/thumbnail",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Apikey: process.env.CLOUDMERSIVE_API_KEY || "",
          extension: "png",
          maxWidth: "400",
          maxHeight: "400",
        },
        responseType: "arraybuffer",
      }
    );

    fs.unlinkSync(tmpPath);
    return Buffer.from(res.data);
  }
}
