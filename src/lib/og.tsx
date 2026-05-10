// Shared layout primitives for next/og auto-generated share cards.
// Every opengraph-image.tsx route uses the same base canvas + branding.
//
// Edge runtime can't use Prisma; we set runtime = "nodejs" in each route
// instead so we can query the DB directly.

import type { CSSProperties } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const COLORS = {
  bg: "#1c1917",       // stone-900
  panel: "#292524",    // stone-800
  text: "#f5f5f4",     // stone-100
  muted: "#a8a29e",    // stone-400
  accent: "#fbbf24",   // amber-400
  divider: "#44403c",  // stone-700
};

export function absoluteUrl(maybeRelative: string | null | undefined): string | null {
  if (!maybeRelative) return null;
  if (maybeRelative.startsWith("http")) return maybeRelative;
  return `${SITE_URL}${maybeRelative.startsWith("/") ? "" : "/"}${maybeRelative}`;
}

const baseShell: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.panel} 100%)`,
  padding: 64,
  color: COLORS.text,
  fontFamily: "serif",
};

const brand: CSSProperties = {
  fontSize: 24,
  letterSpacing: 4,
  textTransform: "uppercase",
  color: COLORS.muted,
  fontFamily: "sans-serif",
};

const footer: CSSProperties = {
  marginTop: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderTop: `1px solid ${COLORS.divider}`,
  paddingTop: 20,
  fontSize: 22,
  color: COLORS.muted,
  fontFamily: "sans-serif",
};

const title: CSSProperties = {
  fontSize: 88,
  lineHeight: 1.05,
  fontFamily: "serif",
  color: COLORS.text,
  marginTop: 32,
  display: "flex",
};

const subtitle: CSSProperties = {
  fontSize: 32,
  marginTop: 16,
  color: COLORS.muted,
  fontFamily: "sans-serif",
  display: "flex",
};

const eyebrow: CSSProperties = {
  fontSize: 22,
  textTransform: "uppercase",
  letterSpacing: 3,
  color: COLORS.accent,
  fontFamily: "sans-serif",
  display: "flex",
};

// ────────────────────────────────────────────────────────────
// Card renderers — each returns JSX consumed by ImageResponse.
// ────────────────────────────────────────────────────────────

export function ogDefault({
  heading = "Dynastica",
  tagline = "Royal houses, lineages, and ruling dynasties of history",
}: { heading?: string; tagline?: string } = {}) {
  return (
    <div style={baseShell}>
      <div style={brand}>Dynastica</div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={title}>{heading}</div>
        <div style={{ ...subtitle, fontSize: 36, maxWidth: 900 }}>{tagline}</div>
      </div>
      <div style={footer}>
        <div>dynastica.net</div>
        <div style={{ color: COLORS.accent }}>An interactive royal genealogy</div>
      </div>
    </div>
  );
}

export function ogDynasty(props: {
  name: string;
  nativeName?: string | null;
  region?: string | null;
  span?: string | null;
  coatOfArmsUrl?: string | null;
}) {
  const coat = absoluteUrl(props.coatOfArmsUrl);
  return (
    <div style={baseShell}>
      <div style={brand}>Dynastica</div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
        {coat && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coat}
            alt=""
            width={240}
            height={240}
            style={{ width: 240, height: 240, objectFit: "contain" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={eyebrow}>Dynasty</div>
          <div style={title}>{props.name}</div>
          {props.nativeName && (
            <div style={{ ...subtitle, fontStyle: "italic" }}>{props.nativeName}</div>
          )}
          <div style={subtitle}>
            {[props.region, props.span].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>
      <div style={footer}>
        <div>dynastica.net</div>
        <div style={{ color: COLORS.accent }}>Lineage · biographies · interactive tree</div>
      </div>
    </div>
  );
}

export function ogFigure(props: {
  name: string;
  nativeName?: string | null;
  titles: string[];
  lifespan?: string | null;
  reign?: string | null;
  dynastyName?: string | null;
  portraitUrl?: string | null;
}) {
  const portrait = absoluteUrl(props.portraitUrl);
  return (
    <div style={baseShell}>
      <div style={brand}>Dynastica</div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
        {portrait && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portrait}
            alt=""
            width={280}
            height={280}
            style={{
              width: 280,
              height: 280,
              objectFit: "cover",
              border: `2px solid ${COLORS.divider}`,
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {props.dynastyName && <div style={eyebrow}>House of {props.dynastyName}</div>}
          <div style={title}>{props.name}</div>
          {props.nativeName && (
            <div style={{ ...subtitle, fontStyle: "italic" }}>{props.nativeName}</div>
          )}
          {props.titles.length > 0 && (
            <div style={subtitle}>{props.titles.slice(0, 2).join(" · ")}</div>
          )}
          {(props.lifespan || props.reign) && (
            <div style={{ ...subtitle, fontSize: 26, marginTop: 8 }}>
              {[props.lifespan && `Lived ${props.lifespan}`, props.reign && `Reigned ${props.reign}`]
                .filter(Boolean)
                .join("  ·  ")}
            </div>
          )}
        </div>
      </div>
      <div style={footer}>
        <div>dynastica.net</div>
      </div>
    </div>
  );
}

export function ogCollection(props: {
  eyebrow: string;
  heading: string;
  description?: string | null;
  meta?: string | null;
}) {
  return (
    <div style={baseShell}>
      <div style={brand}>Dynastica</div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={eyebrow}>{props.eyebrow}</div>
        <div style={title}>{props.heading}</div>
        {props.description && (
          <div style={{ ...subtitle, maxWidth: 1000 }}>{props.description}</div>
        )}
        {props.meta && (
          <div style={{ ...subtitle, color: COLORS.accent, marginTop: 12 }}>{props.meta}</div>
        )}
      </div>
      <div style={footer}>
        <div>dynastica.net</div>
      </div>
    </div>
  );
}
