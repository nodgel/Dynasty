"use client";

import { usePathname } from "next/navigation";
import SearchInput from "./SearchInput";

// Wraps the header SearchInput in a pathname-aware conditional. On "/"
// the homepage hero already shows a large primary search form, so the
// header version would be redundant. Returns null there and renders
// normally everywhere else.
export default function HeaderSearchSlot() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div className="ml-auto w-full max-w-xs">
      <SearchInput />
    </div>
  );
}
