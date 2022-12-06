export function getNativeBoolean(booleanString: string): boolean {
  return getNativeInteger(booleanString) === 1;
}

export function getNativeDate(timeString: string): Date {
  const matches = timeString.match(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
  );

  if (!matches) throw new Error("Not a date string");

  const [year, month, day, hour, min, sec] = matches
    .slice(1)
    .map((value) => parseInt(value, 10));

  return new Date(year, month - 1, day, hour, min, sec);
}

export function getNativeFloat(floatString: string): number {
  return parseFloat(floatString);
}

export function getNativeInteger(integerString: string): number {
  return parseInt(integerString, 10);
}
