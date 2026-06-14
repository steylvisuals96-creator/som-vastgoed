import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  if (secret !== process.env.ADMIN_SECRET) {
    return new Response("Ongeldig wachtwoord.", { status: 401 });
  }

  const jar = await cookies();
  jar.set("som_admin", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dagen
  });

  redirect(redirectTo);
}
