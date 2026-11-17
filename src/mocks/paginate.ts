export function paginate<T>(items: T[], searchParams: URLSearchParams) {
  const pageSize = Math.min(
    Math.max(Number(searchParams.get("pageSize")) || 10, 1),
    100,
  );
  const totalCount = items.length;
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const page = Math.min(
    Math.max(Number(searchParams.get("page")) || 1, 1),
    totalPages,
  );
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    meta: { page, pageSize, totalCount, totalPages },
  };
}
