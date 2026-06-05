import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  (await draftMode()).enable();
  redirect(redirectTo);
}
