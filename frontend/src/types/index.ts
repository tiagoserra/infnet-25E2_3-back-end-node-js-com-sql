export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  type: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  login: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  cover?: string;
  startDate: string;
  endDate: string;
}

export const EnrollmentStatus = {
  IN_PROGRESS: 'in_progress',
  CONCLUDED: 'concluded',
  CANCELED: 'canceled',
  FAIL: 'fail'
} as const;

export type EnrollmentStatus = typeof EnrollmentStatus[keyof typeof EnrollmentStatus];

export interface Enrollment {
  id: number;
  enrollDate: string;
  conclusionDate?: string;
  userId: number;
  courseId: number;
  status: EnrollmentStatus;
  course?: Course;
}

export interface CourseWithEnrollment extends Course {
  userEnrollment?: Enrollment;
}

export interface CoursesState {
  courses: CourseWithEnrollment[];
  pagination: Pagination | null;
  searchParams: CourseSearchParams;
  cache: Record<string, PaginatedResult<CourseWithEnrollment>>;
  loading: boolean;
  error: string | null;
}

export interface EnrollmentsState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
  message: string;
}

export interface CourseSearchParams {
  page: number;
  limit: number;
  search?: string;
}