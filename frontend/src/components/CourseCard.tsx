import React, { useState } from 'react';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useAppDispatch } from '../hooks/redux';
import { enrollInCourse, cancelEnrollment } from '../store/coursesSlice';
import type { CourseWithEnrollment } from '../types';

interface CourseCardProps {
  course: CourseWithEnrollment;
  onEnrollmentCanceled?: (courseId: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnrollmentCanceled }) => {
  const dispatch = useAppDispatch();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isEnrolled = course.userEnrollment?.status === 'in_progress';
  const isCanceled = course.userEnrollment?.status === 'canceled';
  const isConcluded = course.userEnrollment?.status === 'concluded';

  const handleEnroll = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsEnrolling(true);
    try {
      await dispatch(enrollInCourse(course.id)).unwrap();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCancelEnrollment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (course.userEnrollment?.id) {
      setIsCanceling(true);
      try {
        await dispatch(cancelEnrollment({
          enrollmentId: course.userEnrollment.id,
          courseId: course.id
        })).unwrap();
        
        // Chama o callback para notificar que o cancelamento foi bem-sucedido
        if (onEnrollmentCanceled) {
          onEnrollmentCanceled(course.id);
        }
      } catch (error) {
        console.error('Error canceling enrollment:', error);
      } finally {
        setIsCanceling(false);
      }
    }
  };

  const getStatusBadge = () => {
    if (!course.userEnrollment) return null;
    
    const statusMap = {
      'in_progress': { text: 'Matriculado', variant: 'success' },
      'concluded': { text: 'Concluído', variant: 'primary' },
      'canceled': { text: 'Cancelado', variant: 'secondary' },
      'fail': { text: 'Reprovado', variant: 'danger' }
    };

    const status = statusMap[course.userEnrollment.status as keyof typeof statusMap];
    
    // Verificação de segurança - se o status não existir, não renderiza o badge
    if (!status) return null;
    
    return (
      <Badge bg={status.variant} className="mb-2">
        {status.text}
      </Badge>
    );
  };

  const getActionButton = () => {
    if (isEnrolled) {
      return (
        <Button
          type="button"
          variant="outline-danger"
          onClick={handleCancelEnrollment}
          className="w-100"
          disabled={isCanceling}
        >
          {isCanceling ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Cancelando...
            </>
          ) : (
            <>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar Inscrição
            </>
          )}
        </Button>
      );
    }

    if (isCanceled || isConcluded) {
      return (
        <Button
          type="button"
          variant="outline-primary"
          onClick={handleEnroll}
          className="w-100"
          disabled={isEnrolling}
        >
          {isEnrolling ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Inscrevendo...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-repeat me-2"></i>
              Inscrever-se
            </>
          )}
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="primary"
        onClick={handleEnroll}
        className="w-100"
        disabled={isEnrolling}
      >
        {isEnrolling ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Inscrevendo...
          </>
        ) : (
          <>
            <i className="bi bi-plus-circle me-2"></i>
            Inscrever-se
          </>
        )}
      </Button>
    );
  };

  const defaultImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

  return (
    <Card className="h-100 shadow-sm border-0 course-card">
      <Card.Img
        variant="top"
        src={course.cover || defaultImage}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.currentTarget.src = defaultImage;
        }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          {getStatusBadge()}
          <Card.Title className="h5 mb-2">{course.name}</Card.Title>
          <Card.Text className="text-muted mb-3">
            {course.description}
          </Card.Text>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">
                <i className="bi bi-calendar me-1"></i>
                <strong>Início:</strong>
              </small>
              <small className="text-muted">
                {formatDate(course.startDate)}
              </small>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                <i className="bi bi-calendar-check me-1"></i>
                <strong>Término:</strong>
              </small>
              <small className="text-muted">
                {formatDate(course.endDate)}
              </small>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          {getActionButton()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;