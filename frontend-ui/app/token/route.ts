import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const newAccessToken = await req.json().then((data) => data.accessToken);

  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
  });

  return new Response(null, { status: 200 });
}
