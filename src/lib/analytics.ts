// Google Analytics 4 measurement ID. Looks like "G-XXXXXXXXXX".
//
// HOW TO GET IT
//   1. Go to https://analytics.google.com
//   2. If you don't have a property yet: Admin → Create property → Web →
//      "Dynastica" → set timezone → Create. Then add a Data Stream for
//      https://dynastica.net.
//   3. Open the Web data stream you just created. The "Measurement ID" in the
//      top right is what you want — copy it (the part starting with G-).
//   4. Paste it below as a string, redeploy, and analytics start flowing.
//
// Empty string = GA scripts are not loaded at all (zero traffic to Google).
export const GA_MEASUREMENT_ID = "" as string;
