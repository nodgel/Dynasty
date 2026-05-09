// Central registry of AdSense ad unit IDs. To turn a placeholder into a real
// ad, fill in the corresponding string with the ad-unit ID that AdSense
// generates when you create the unit in the dashboard.
//
// HOW TO CREATE AN AD UNIT
//   1. Go to https://adsense.google.com → Ads → "By ad unit" tab
//   2. Click "Create new ad unit" → pick a type:
//        • Display ad → for header banners and sidebar rectangles
//        • In-feed / In-article → for content-flow placements (we don't use
//          these yet but could)
//        • Multiplex → recommended-content grids
//   3. Choose "Responsive" size for our header banners; "Fixed" 300×250 for
//      sidebars, 300×600 for the half-page slot.
//   4. Give the unit a name that matches the key below (e.g. "dynasty-header").
//   5. Save → Google shows you a snippet. The number after `data-ad-slot=` is
//      the slot ID. Copy ONLY that number into the right slot below.
//
// Empty string = no ad rendered, fallback placeholder shown. Once you paste
// real IDs and redeploy, the dashed boxes turn into live ads.
//
// Your publisher ID (ca-pub-6464335713430876) is a constant — only the per-
// unit slot IDs go here.

export const PUBLISHER_ID = "ca-pub-6464335713430876";

export const AD_SLOTS = {
  // Home page, top banner
  homeHeader: "",
  // Dynasties index page, top banner
  dynastiesIndexHeader: "",
  // Single dynasty page, top banner
  dynastyHeader: "",
  // Single dynasty page, right rail (top)
  dynastySidebar1: "",
  // Single dynasty page, right rail (bottom, taller)
  dynastySidebar2: "",
  // Single figure page, top banner
  figureHeader: "",
  // Single figure page, right rail
  figureSidebar: "",
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;

export function getSlotId(name: AdSlotName): string | undefined {
  const id = AD_SLOTS[name];
  return id ? id : undefined;
}
