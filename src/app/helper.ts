export function formatTimes(value: number): string {
  return String(value).length === 1 ? `0${String(value)}` : String(value);
}
