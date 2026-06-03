export type PaginationRangeItem = number | 'ellipsis';

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationRangeItem[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(2, currentPage - siblingCount);
  const right = Math.min(totalPages - 1, currentPage + siblingCount);
  const range: PaginationRangeItem[] = [1];

  if (left > 2) {
    range.push('ellipsis');
  }

  for (let page = left; page <= right; page++) {
    range.push(page);
  }

  if (right < totalPages - 1) {
    range.push('ellipsis');
  }

  range.push(totalPages);

  return range;
}
