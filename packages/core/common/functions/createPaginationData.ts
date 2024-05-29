export function setPaginationData(productsLength: number, total: number, per_page: number, current_page: number) {
  return {
    current_page,
    total_pages: Math.ceil(total / per_page),
    per_page,
    count: productsLength,
    total,
  }
}
