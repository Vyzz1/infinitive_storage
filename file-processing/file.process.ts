import { CloudmersiveService } from "./cloudmersive.service";
import { UploadService } from "./upload.service";
import mime from "mime-types";
export class FileProcessor {
  private readonly uploadService: UploadService;
  private readonly cloudMersiveService: CloudmersiveService;

  constructor() {
    this.uploadService = new UploadService();
    this.cloudMersiveService = new CloudmersiveService();
  }

  async processThumbnailTask(fileData: {
    filename: string;
    mimetype: string;
    data: string;
  }): Promise<string> {
    try {
      const { filename, data } = fileData;

      if (!filename || !data) throw new Error("Missing required fields");

      const mimetype = mime.lookup(filename) || "application/octet-stream";

      const ext = mime.extension(mimetype) || "bin";

      console.log(` Processing file: ${filename} (${mimetype}, .${ext})`);
      let buffer = Buffer.from(data, "base64");
      if (!buffer.length) throw new Error("Empty buffer received");

      const officeExts = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

      let uploadBuffer: any = buffer;
      let resourceType: "image" | "raw" = "image";

      if (officeExts.includes(ext)) {
        console.log(" Converting Office document to PDF...");
        uploadBuffer = await this.cloudMersiveService.cloudmersiveConvertToPdf(
          buffer,
          filename
        );
        resourceType = "image";
      } //else if (mimetype === "application/pdf") {
      //console.log("PDF detected, uploading directly to Cloudinary...");
      // resourceType = "image";
      //}
      else {
        console.log("Converting to thumbnail via Cloudmersive...");
        uploadBuffer =
          await this.cloudMersiveService.cloudmersivePdfToThumbnail(buffer);
        resourceType = "image";
      }

      const uploadOptions: any = {
        folder: "food-ordering-asp.net",
        resource_type: resourceType,
        format: "png",
        transformation: [
          {
            width: 220,
            height: 220,
            gravity: "center",
            crop: "pad",
            background: "white",
            quality: 95,
            dpr: "2.0",
            flags: "progressive",
            page: 1,
          },
          {
            fetch_format: "webp",
            quality: "auto:good",
          },
        ],
      };

      const result: any = await this.uploadService.uploadBufferToCloudinary(
        uploadBuffer,
        uploadOptions
      );

      if (!result?.secure_url) throw new Error("Cloudinary upload failed");
      return result.secure_url;
    } catch (error) {
      throw error;
    }
  }
}
