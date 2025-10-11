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
