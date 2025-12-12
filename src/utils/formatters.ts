export function onlyNumbers(value: string): string;
export function onlyNumbers(value: number): string;
export function onlyNumbers(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/\D/g, "");
}

