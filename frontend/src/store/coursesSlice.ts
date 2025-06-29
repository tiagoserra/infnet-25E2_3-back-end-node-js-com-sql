import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { coursesApi, enrollmentsApi } from '../services/coursesApi';
import type { CoursesState, CourseSearchParams } from '../types';

const initialState: CoursesState = {
  courses: [],
  pagination: null,
  searchParams: {
    page: 1,
    limit: 25,
    search: ''
  },
  cache: {},
  loading: false,
  error: null,
};

const createCacheKey = (params: CourseSearchParams): string => {
  return `page_${params.page}_limit_${params.limit}_search_${params.search || ''}`;
};

export const fetchCoursesWithEnrollments = createAsyncThunk(
  'courses/fetchCoursesWithEnrollments',
  async (userId: number, { rejectWithValue }) => {
    try {
      const courses = await coursesApi.getCoursesWithEnrollmentStatus(userId);
      return courses;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchPaginatedCoursesWithEnrollments = createAsyncThunk(
  'courses/fetchPaginatedCoursesWithEnrollments',
  async ({ userId, searchParams }: { userId: number; searchParams: CourseSearchParams }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { courses: CoursesState };
      const cacheKey = createCacheKey(searchParams);

      if (state.courses.cache[cacheKey]) {
        return {
          courses: state.courses.cache[cacheKey].data,
          pagination: state.courses.cache[cacheKey].pagination,
          cacheKey,
          fromCache: true
        };
      }

      const result = await coursesApi.getPaginatedCoursesWithEnrollmentStatus(userId, searchParams);
      
      return {
        courses: result.courses,
        pagination: result.pagination,
        cacheKey,
        fromCache: false
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch paginated courses');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enrollInCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const enrollment = await enrollmentsApi.createEnrollment(courseId);
      return { courseId, enrollment };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll in course');
    }
  }
);

export const cancelEnrollment = createAsyncThunk(
  'courses/cancelEnrollment',
  async ({ enrollmentId, courseId }: { enrollmentId: number; courseId: number }, { rejectWithValue }) => {
    try {
      const enrollment = await enrollmentsApi.cancelEnrollment(enrollmentId);
      return { courseId, enrollment };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel enrollment');
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCoursesWithEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesWithEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCoursesWithEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      

      .addCase(enrollInCourse.pending, (state) => {
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        const { courseId, enrollment } = action.payload;
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        if (courseIndex !== -1) {
          state.courses[courseIndex].userEnrollment = enrollment;
        }
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      .addCase(cancelEnrollment.pending, (state) => {
        state.error = null;
      })
      .addCase(cancelEnrollment.fulfilled, (state, action) => {
        const { courseId } = action.payload;
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        if (courseIndex !== -1) {
          state.courses[courseIndex].userEnrollment = undefined;
        }
        state.error = null;
      })
      .addCase(cancelEnrollment.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchPaginatedCoursesWithEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaginatedCoursesWithEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
        state.error = null;

        if (!action.payload.fromCache) {
          state.cache[action.payload.cacheKey] = {
            data: action.payload.courses,
            pagination: action.payload.pagination
          };
        }
      })
      .addCase(fetchPaginatedCoursesWithEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSearchParams, clearCache } = coursesSlice.actions;
export default coursesSlice.reducer;