import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Dynastica collects, uses, and shares information — including the use of Google AdSense advertising cookies.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "May 9, 2026";
const CONTACT_EMAIL = "privacy@dynastica.net";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy Policy" }]} />

      <article className="prose-bio">
        <h1 className="font-serif text-3xl text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-stone-500 mb-8">Last updated: {LAST_UPDATED}</p>

        <p>
          This Privacy Policy describes how Dynastica (&ldquo;we,&rdquo; &ldquo;our,&rdquo; the
          &ldquo;Site&rdquo;) collects, uses, and shares information when you visit{" "}
          <strong>dynastica.net</strong>. By using the Site, you agree to the practices described
          here.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">Information we collect</h2>
        <p>
          Dynastica is a read-only reference site. We do not require accounts, do not host
          comments, and do not collect personal information you submit directly. The information
          we do receive falls into two categories:
        </p>
        <ul className="list-disc pl-6 my-3 space-y-1">
          <li>
            <strong>Automatic server logs.</strong> Like every web server, ours records the IP
            address, browser type, referring page, and timestamp of each request. We use these
            logs only for security, debugging, and aggregate traffic analysis. Logs are retained
            for a limited period and are not sold or shared with third parties.
          </li>
          <li>
            <strong>Search queries.</strong> If you use the on-site search box, your query is
            sent to our server to look up matching dynasties and figures. Queries are not
            associated with any persistent identifier.
          </li>
        </ul>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">
          Cookies and advertising
        </h2>
        <p>
          Dynastica itself does not set cookies on visitors&apos; browsers (the only cookie we
          issue is a session cookie for the administrative back-end, which ordinary visitors do
          not encounter). However, third-party services we use, primarily Google AdSense, may set
          their own cookies and similar technologies for the purpose of serving ads.
        </p>
        <p className="mt-3">
          <strong>Google AdSense.</strong> We display advertising via Google AdSense. Google,
          as a third-party vendor, uses cookies (including the DoubleClick DART cookie) and
          similar technologies to serve ads based on your prior visits to this Site and other
          websites. Google&apos;s use of advertising cookies enables it and its partners to serve
          ads to users based on their visits to this and other sites on the Internet. You may
          opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-link"
          >
            Google Ads Settings
          </a>
          , or by visiting{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-link"
          >
            aboutads.info
          </a>
          {" "}to opt out of third-party vendor use of cookies for personalized advertising. For
          more information, see Google&apos;s{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-link"
          >
            advertising policies
          </a>
          {" "}and{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-link"
          >
            privacy policy
          </a>
          .
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">Third-party services</h2>
        <ul className="list-disc pl-6 my-3 space-y-1">
          <li>
            <strong>Google Analytics.</strong> We use Google Analytics 4 to understand
            aggregate traffic patterns (which pages are read, where visitors come from). Google
            Analytics sets its own cookies and may transfer information about your visit
            (including IP address, in truncated form) to Google. You can opt out by installing
            the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="wiki-link"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            . We do not link analytics data to identifiable users.
          </li>
          <li>
            <strong>Google Fonts.</strong> Typography is loaded via Google Fonts. When you
            request a page, your browser may fetch font files from Google&apos;s servers, which
            transfers your IP address to Google.
          </li>
          <li>
            <strong>Affiliate links — Amazon Associates.</strong> Dynastica is a participant in
            the Amazon Services LLC Associates Program, an affiliate advertising program designed
            to provide a means for sites to earn advertising fees by advertising and linking to
            Amazon.com. As an Amazon Associate we earn from qualifying purchases. Affiliate links
            (notably in the &ldquo;Recommended Reading&rdquo; sections) may carry a tracking
            identifier so Amazon can attribute the purchase to this Site. Amazon sets its own
            cookies on its destination pages; we do not receive personal information about your
            purchases.
          </li>
        </ul>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">How we use information</h2>
        <p>We use the information described above only to:</p>
        <ul className="list-disc pl-6 my-3 space-y-1">
          <li>Operate, maintain, and improve the Site.</li>
          <li>Detect and prevent abuse, malicious traffic, and security issues.</li>
          <li>Display advertising via the third parties listed above.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p>
          We do not sell personal information. We do not run a mailing list. We do not build
          profiles of individual visitors.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">Your choices and rights</h2>
        <ul className="list-disc pl-6 my-3 space-y-1">
          <li>
            <strong>Opt out of personalized ads.</strong> Use the Google and DAA links in the
            Cookies and advertising section above.
          </li>
          <li>
            <strong>Block cookies.</strong> Most browsers let you refuse third-party cookies.
            Doing so may make the ads you see less relevant but will not break the Site.
          </li>
          <li>
            <strong>EU/UK (GDPR) and California (CCPA) residents.</strong> Because we store no
            personal information beyond short-lived server logs, there is generally no personal
            data to access, correct, port, or delete on our side. For data held by Google or
            other third parties, please use those parties&apos; own controls.
          </li>
        </ul>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">
          Children&apos;s privacy
        </h2>
        <p>
          Dynastica is intended for a general audience and is not directed at children under 13.
          We do not knowingly collect personal information from children. If you believe a child
          has provided us with personal information, please contact us and we will delete it.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">
          International data transfers
        </h2>
        <p>
          The Site is hosted on infrastructure that may be located in different countries.
          Third-party services we use (such as Google) operate globally and may transfer data
          across borders. By using the Site, you consent to such transfers where permitted by
          applicable law.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">Changes to this policy</h2>
        <p>
          We may update this Privacy Policy as the Site evolves or as legal requirements change.
          The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent
          change. Material changes will be highlighted on the home page for a reasonable period
          following the update.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8 mb-3">Contact</h2>
        <p>
          Questions about this policy or about your data can be sent to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="wiki-link">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </article>
    </main>
  );
}
