import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY!);

const { data, error } = await resend.emails.send({
  from: "Acme <onboarding@resend.dev>",
  to: ["vyauth28@gmail.com"],
  subject: "hello world",
  html: "<p>it works!</p>",
  replyTo: "onboarding@resend.dev",
});

console.log({ data, error });
