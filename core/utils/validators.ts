export function throwIfNoValueGiven(value: any, errorMessage: string) {
  if (!value) {
    throw new Error(errorMessage);
  }

  if (value instanceof Array && value.length === 0) {
    throw new Error(errorMessage);
  }
}
