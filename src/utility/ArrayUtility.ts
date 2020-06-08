export function flatten(array: any[]): any[] {
  const flattenedArray: any[] = [];
  for (const item of array) {
      if (Array.isArray(item)) {
          flattenedArray.push(...flatten(item));
      } else {
          flattenedArray.push(item);
      }
  }
  return flattenedArray;
}

export function distinct<T>(array: T[]): T[] {
  const distinctValues = new Set<T>(array);
  return Array.from<T>(distinctValues);
}
