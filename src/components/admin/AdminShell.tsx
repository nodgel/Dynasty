import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 h-12 flex items-center gap-6">
          <Link href="/admin" className="font-serif text-stone-900">
            Dynastica · Admin
          </Link>
          <nav aria-label="Admin">
            <ul className="flex gap-4 text-sm text-stone-600">
              <li><Link href="/admin" className="hover:text-stone-900">Dashboard</Link></li>
              <li><Link href="/admin/events" className="hover:text-stone-900">Events</Link></li>
              <li><Link href="/admin/dynasties/new" className="hover:text-stone-900">+ Dynasty</Link></li>
              <li><Link href="/admin/events/new" className="hover:text-stone-900">+ Event</Link></li>
              <li><Link href="/admin/import" className="hover:text-stone-900">Import</Link></li>
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link href="/" className="text-stone-500 hover:text-stone-900" target="_blank" rel="noreferrer">
              View site ↗
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="text-stone-500 hover:text-stone-900">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
