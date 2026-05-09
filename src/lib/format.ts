// Year fields are stored as signed integers — negative for BC, positive for AD.
// (There is no year 0 historically; we don't enforce that here.)

export function formatYear(year: number | null | undefined): string {
  if (year == null) return "";
  return year < 0 ? `${-year} BC` : `${year}`;
}

export function formatYearRange(
  birth: number | null | undefined,
  death: number | null | undefined
): string {
  if (birth != null && death != null) return `${formatYear(birth)} – ${formatYear(death)}`;
  if (birth != null) return `b. ${formatYear(birth)}`;
  if (death != null) return `d. ${formatYear(death)}`;
  return "";
}
