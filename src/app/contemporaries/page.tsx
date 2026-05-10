import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContemporariesView from "@/components/ContemporariesView";
import { listAllFiguresWithDates } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contemporaries — who was alive together",
  description:
    "Drag through the centuries to see every royal figure alive at any given year, grouped by dynasty.",
  alternates: { canonical: "/contemporaries" },
};

const DEFAULT_YEAR = 1200;

export default async function ContemporariesLandingPage() {
  const figures = await listAllFiguresWithDates();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contemporaries" }]} />
      <ContemporariesView initialYear={DEFAULT_YEAR} figures={figures} />
    </main>
  );
}
