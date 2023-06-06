export interface Pagination<T> {
  items: T[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface Gender {
  id: number;
  type: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Benefit {
  id: number;
  name: string;
}
