import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const jar = await cookies();
  jar.delete("som_admin");
  jar.delete("__prerender_bypass"); // draft mode cookie

  redirect(redirectTo);
}
