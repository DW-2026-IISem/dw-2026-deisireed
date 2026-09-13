export function calculatePagination(page: number = 1, limit: number = 10) {
  const parsedPage = Math.max(1, page);
  const parsedLimit = Math.max(1, limit);
  const offset = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
  };
}
