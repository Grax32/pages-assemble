import { FileContext } from '../models';

export function normalizeSortOrder(value?: string): string {
  return ((value || '') + '').toUpperCase();
}
export function compareStrings(a?: string | undefined, b?: string): number {
  const left = normalizeSortOrder(a);
  const right = normalizeSortOrder(b);

  if (left === right) {
    return 0;
  }

  return left > right ? 1 : -1;
}
export function sortAssets(assets: FileContext[], reverseSort: boolean = false) {
  const multiplier = reverseSort ? -1 : 1;
  assets.sort((a, b) => compareStrings(a.frontMatter.sortOrder, b.frontMatter.sortOrder) * multiplier);
}
