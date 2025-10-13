import { cookies } from "next/headers";

const getCookies = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("connect.sid");

  if (!sessionCookie) {
    console.log("No session cookie found");
    throw new Error("No session cookie found");
  }

  return `connect.sid=${sessionCookie.value}`;
};

export default getCookies;

const apiUrl =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8888/api";
export { apiUrl };
