export interface Chat {
  id: string;
  title: string | null;
  created_at: string;
  is_active: boolean;
  messages: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
