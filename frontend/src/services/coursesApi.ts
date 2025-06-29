import api from './api';
import type { Course, Enrollment, ApiResponse, CourseWithEnrollment, PaginatedApiResponse, CourseSearchParams, Pagination } from '../types';

export const coursesApi = {

  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>('/courses');
    return response.data.data;
  },

  getActiveCourses: async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>('/courses/active');
    return response.data.data;
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return response.data.data;
  },

  getPaginatedCourses: async (params: CourseSearchParams): Promise<PaginatedApiResponse<Course>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    
    if (params.search) {
      queryParams.append('search', params.search);
    }

    const response = await api.get<PaginatedApiResponse<Course>>(`/courses/paginated?${queryParams}`);
    return response.data;
  },

  // Get courses with user enrollment status
  getCoursesWithEnrollmentStatus: async (userId: number): Promise<CourseWithEnrollment[]> => {
    const [coursesResponse, enrollmentsResponse] = await Promise.all([
      api.get<ApiResponse<Course[]>>('/courses'),
      api.get<ApiResponse<Enrollment[]>>(`/enrollments/user/${userId}`)
    ]);

    const courses = coursesResponse.data.data;
    const enrollments = enrollmentsResponse.data.data;

    return courses.map(course => {
      const userEnrollment = enrollments.find(
        enrollment => enrollment.courseId === course.id
      );
      return {
        ...course,
        userEnrollment
      };
    });
  },

  getPaginatedCoursesWithEnrollmentStatus: async (
    userId: number, 
    params: CourseSearchParams
  ): Promise<{ courses: CourseWithEnrollment[]; pagination: Pagination }> => {
    const [coursesResponse, enrollmentsResponse] = await Promise.all([
      coursesApi.getPaginatedCourses(params),
      api.get<ApiResponse<Enrollment[]>>(`/enrollments/user/${userId}`)
    ]);

    const courses = coursesResponse.data;
    const enrollments = enrollmentsResponse.data.data;

    const coursesWithEnrollment = courses.map(course => {
      const userEnrollment = enrollments.find(
        enrollment => enrollment.courseId === course.id
      );
      return {
        ...course,
        userEnrollment
      };
    });

    return {
      courses: coursesWithEnrollment,
      pagination: coursesResponse.pagination
    };
  }
};

export const enrollmentsApi = {

  createEnrollment: async (courseId: number): Promise<Enrollment> => {
    const response = await api.post<ApiResponse<Enrollment>>('/enrollments', {
      courseId
    });
    return response.data.data;
  },

  cancelEnrollment: async (enrollmentId: number): Promise<Enrollment> => {
    const response = await api.patch<ApiResponse<Enrollment>>(`/enrollments/${enrollmentId}/cancel`);
    return response.data.data;
  },

  getUserEnrollments: async (userId: number): Promise<Enrollment[]> => {
    const response = await api.get<ApiResponse<Enrollment[]>>(`/enrollments/user/${userId}`);
    return response.data.data;
  },

  getEnrollmentById: async (id: number): Promise<Enrollment> => {
    const response = await api.get<ApiResponse<Enrollment>>(`/enrollments/${id}`);
    return response.data.data;
  },

  getUserEnrolledCourses: async (userId: number): Promise<CourseWithEnrollment[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/enrollments/user/${userId}/courses`);
    
    return response.data.data.map(item => ({
      id: item.course.id,
      name: item.course.name,
      description: item.course.description,
      cover: item.course.cover,
      startDate: item.course.startDate,
      endDate: item.course.endDate,
      userEnrollment: {
        id: item.id,
        enrollDate: item.enrollDate,
        conclusionDate: item.conclusionDate,
        userId: item.userId,
        courseId: item.courseId,
        status: item.status
      }
    }));
  }
};