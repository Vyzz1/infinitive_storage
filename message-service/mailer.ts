import * as nodemailer from "nodemailer";
import * as fs from "fs";
import * as handlebars from "handlebars";
import path from "path";
import dotenv from "dotenv";
import Mail from "nodemailer/lib/mailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_TO,
    pass: process.env.MAILER_PASSWORD,
  },
});

const compileTemplate = async (
  templateName: string,
  data: Record<string, any>
) => {
  // Resolve template path relative to this module's directory so it points
  // to `message-service/templates` when running from the package source.
  const filePath = path.join(
    __dirname,
    "templates",
    `${templateName}.handlebars`
  );

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch (err) {
    console.error(`Template not found or not readable at: ${filePath}`);
    throw err;
  }

  const html = await fs.promises.readFile(filePath, "utf-8");
  const template = handlebars.compile(html);
  return template(data);
};

const sendMail = async (
  to: string,
  subject: string,
  template: string,
  data: Record<string, any>
) => {
  try {
    const htmlContent = await compileTemplate(template, data);

    const mailOptions: Mail.Options = {
      from: `No Reply <${process.env.MAILER_TO}>`,
      to,
      subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", result.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export default {
  sendMail,
};
