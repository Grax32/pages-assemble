export function requireNotNullOrUndefined(...values: any[]) {
  for (const value of values) {
    if (isNullOrUndefined(value)) {
      throw new Error('Value must not be null or undefined');
    }
  }
}

/** @description Discriminate if value is null or undefined, 
 * return true or throw error
 */
export function requireValueNotNullOrUndefined<T>(value?: T): value is T {
  if (isNullOrUndefined(value)) {
    throw new Error('Value must not be null or undefined');
  }

  return true;
}

export function isNullOrUndefined(value: any) {
  return value === undefined || value === null;
}
