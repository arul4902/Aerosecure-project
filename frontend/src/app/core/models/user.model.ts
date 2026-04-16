export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  enabled?: boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: string;
  userId: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
