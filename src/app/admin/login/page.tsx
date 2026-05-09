import type { Metadata } from "next";
import { signInAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const hasError = sp.error === "1";
  const next = sp.next ?? "/admin";

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-serif text-2xl text-stone-900">Admin sign in</h1>
      <p className="mt-2 text-sm text-stone-500">
        Restricted area. Public site visitors don&apos;t need this page.
      </p>

      <form action={signInAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="password" className="block text-sm text-stone-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            required
            autoComplete="current-password"
            className="w-full h-10 px-3 text-sm rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        {hasError && (
          <p className="text-sm text-red-600">Incorrect password.</p>
        )}
        <button
          type="submit"
          className="w-full h-10 rounded-md bg-stone-900 text-white text-sm hover:bg-stone-700"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
