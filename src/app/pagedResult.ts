export interface PagedResult<T> {
    resultsArray: T[];
    count: number;
    pageSize: number;
    currentPage: number;
    message: string;
}