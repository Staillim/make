import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("maket_session")?.value;
  deleteSession(token);
  const response = NextResponse.json({ success: true });
  response.cookies.set("maket_session", "", { path: "/", expires: new Date(0) });
  return response;
}
