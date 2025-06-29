import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { enrollmentsApi } from '../services/coursesApi';
import CourseCard from './CourseCard';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import type { CourseWithEnrollment } from '../types';

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithEnrollment[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseWithEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingCourseId, setRemovingCourseId] = useState<number | null>(null);

  const fetchEnrolledCourses = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const enrolledCourses = await enrollmentsApi.getUserEnrolledCourses(user.id);
      
      setEnrolledCourses(enrolledCourses);
      setFilteredCourses(enrolledCourses);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response && 
        'data' in error.response && typeof error.response.data === 'object' && 
        error.response.data && 'message' in error.response.data && 
        typeof error.response.data.message === 'string'
        ? error.response.data.message
        : 'Erro ao carregar seus cursos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.id) {
      fetchEnrolledCourses();
    }
  }, [isAuthenticated, navigate, user?.id, fetchEnrolledCourses]);

  useEffect(() => {

    if (searchTerm.trim() === '') {
      setFilteredCourses(enrolledCourses);
    } else {
      const filtered = enrolledCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, enrolledCourses]);

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  const handleEnrollmentCanceled = useCallback((courseId: number) => {
    setRemovingCourseId(courseId);

    setTimeout(() => {
      setEnrolledCourses(prev => prev.filter(course => course.id !== courseId));
      setFilteredCourses(prev => prev.filter(course => course.id !== courseId));
      setRemovingCourseId(null);
    }, 300);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-4">
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="me-2">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
            <div className="mt-2">Carregando seus cursos...</div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <style>{`
        .removing-course {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
      `}</style>
      <Navbar />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-journal-bookmark fs-3 text-primary me-3"></i>
                  <div>
                    <h2 className="mb-1">Meus Cursos</h2>
                    <p className="text-muted mb-0">
                      Cursos nos quais você está inscrito
                    </p>
                  </div>
                </div>
                
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}
                
                {enrolledCourses.length > 0 && (
                  <div className="mb-4">
                    <SearchBar
                      onSearch={handleSearch}
                      placeholder="Buscar em meus cursos..."
                      defaultValue={searchTerm}
                    />
                  </div>
                )}
                
                {/* Results info */}
                <div className="mb-3">
                  <small className="text-muted">
                    {searchTerm ? (
                      <>
                        Resultados para "{searchTerm}": {filteredCourses.length} curso(s) encontrado(s)
                      </>
                    ) : (
                      <>
                        Total: {enrolledCourses.length} curso(s) inscrito(s)
                      </>
                    )}
                  </small>
                </div>
                
                {/* Courses Grid */}
                {filteredCourses.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    <i className="bi bi-info-circle me-2"></i>
                    {searchTerm 
                      ? `Nenhum curso encontrado para "${searchTerm}" em suas inscrições.`
                      : enrolledCourses.length === 0
                        ? 'Você ainda não está inscrito em nenhum curso. Vá para a Home para explorar os cursos disponíveis.'
                        : 'Nenhum curso encontrado.'
                    }
                  </Alert>
                ) : (
                  <Row className="g-4">
                    {filteredCourses.map((course) => (
                      <Col 
                        key={course.id} 
                        xs={12} sm={6} md={6} lg={4} xl={3}
                        className={removingCourseId === course.id ? 'removing-course' : ''}
                      >
                        <CourseCard 
                          course={course} 
                          onEnrollmentCanceled={handleEnrollmentCanceled}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyCourses; 