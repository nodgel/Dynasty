import Link from "next/link";
import HeaderSearchSlot from "./HeaderSearchSlot";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-serif text-xl tracking-tight text-stone-900 hover:text-stone-700">
          Dynastica
        </Link>
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex gap-5 text-sm text-stone-700">
            <li><Link href="/dynasties" className="hover:text-stone-900">Dynasties</Link></li>
            <li><Link href="/contemporaries" className="hover:text-stone-900">Contemporaries</Link></li>
            <li><Link href="/about" className="hover:text-stone-900">About</Link></li>
          </ul>
        </nav>
        <HeaderSearchSlot />
      </div>
    </header>
  );
}
