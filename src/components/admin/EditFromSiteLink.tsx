"use client";

import dynamic from "next/dynamic";

// Hide the admin "Edit" pill from server-side renders entirely. The previous
// implementation guarded with !authed in a client component, which DID render
// null on first paint — but React Server Components still serialized the
// `href` prop into the streaming HTML payload so the client could hydrate.
// That serialized URL was visible to Google's crawler, which then tried to
// crawl /admin/dynasties/<slug> and reported a noindex finding in Search
// Console.
//
// Loading the real implementation via next/dynamic with ssr: false means
// nothing about the component — props, JSX, fallback — appears in the SSR
// payload. The admin URLs only exist in the bundle that runs after the
// /api/admin/me probe succeeds.
const EditFromSiteLinkImpl = dynamic(() => import("./EditFromSiteLinkImpl"), {
  ssr: false,
  loading: () => null,
});

export default function EditFromSiteLink({ href }: { href: string }) {
  return <EditFromSiteLinkImpl href={href} />;
}
