export interface BaseError {
  code: string;
  message: string;
  params?: Record<string, unknown>;
}

export interface ApiError extends BaseError {
  status: number;
  meta: {
    language?: string;
    errors?: string[];
  };
}
