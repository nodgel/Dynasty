"use server";

import { redirect } from "next/navigation";
import {
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";

export async function signInAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await setSessionCookie();
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
