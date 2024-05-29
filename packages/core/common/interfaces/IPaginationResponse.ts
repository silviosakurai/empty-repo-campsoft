export interface IPaginationResponse {
  paging: {
    current_page: number;
    total_pages: number;
    per_page: number;
    count: number;
    total: number;
  };
}
