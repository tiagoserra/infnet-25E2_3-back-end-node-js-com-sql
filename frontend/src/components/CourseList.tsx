import React, { useEffect, useCallback } from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPaginatedCoursesWithEnrollments, clearError, setSearchParams } from '../store/coursesSlice';
import CourseCard from './CourseCard';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import type { CourseSearchParams } from '../types';

const CourseList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courses, pagination, searchParams, loading, error } = useAppSelector((state) => state.courses);
  const { user } = useAppSelector((state) => state.auth);

  const fetchCourses = useCallback((params: CourseSearchParams) => {
    if (user?.id) {
      dispatch(fetchPaginatedCoursesWithEnrollments({ userId: user.id, searchParams: params }));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    fetchCourses(searchParams);
  }, [fetchCourses, searchParams]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    dispatch(setSearchParams(newParams));
  };

  const handleSearch = (searchTerm: string) => {
    const newParams = { ...searchParams, search: searchTerm, page: 1 };
    dispatch(setSearchParams(newParams));
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" className="me-2">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <span>Carregando cursos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mb-4">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar cursos por nome..."
          defaultValue={searchParams.search}
        />
      </div>

      {/* Results info */}
      {pagination && (
        <div className="mb-3">
          <small className="text-muted">
            {searchParams.search ? (
              <>
                Resultados para "{searchParams.search}": {pagination.total} curso(s) encontrado(s)
              </>
            ) : (
              <>
                Total: {pagination.total} curso(s) disponível(s)
              </>
            )}
          </small>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          {searchParams.search 
            ? `Nenhum curso encontrado para "${searchParams.search}".`
            : 'Nenhum curso disponível no momento.'
          }
        </Alert>
      ) : (
        <>
          <Row className="g-4">
            {courses.map((course) => (
              <Col key={course.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {pagination && (
            <div className="mt-4">
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;