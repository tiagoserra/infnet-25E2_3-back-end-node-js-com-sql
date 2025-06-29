import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getCurrentUser } from '../store/authSlice';
import Navbar from './Navbar';
import CourseList from './CourseList';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </Container>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h1 className="display-4 fw-bold text-primary">
                    Bem-vindo, {user.name}!
                  </h1>
                  <p className="lead text-muted">
                    Você está logado no sistema de gestão acadêmica
                  </p>
                </div>


                <div className="mt-5 p-4 bg-light rounded">
                  <Row>
                    <Col md={6}>
                      <h6 className="fw-bold text-muted">Detalhes da Conta:</h6>
                      <ul className="list-unstyled mt-3">
                        <li><strong>Nome:</strong> {user.name}</li>
                        <li><strong>Email:</strong> {user.email}</li>
                        <li><strong>Login:</strong> {user.login}</li>
                        <li><strong>Tipo:</strong> {user.type}</li>
                      </ul>
                    </Col>
                    <Col md={6} className="d-flex align-items-center justify-content-md-end">
                      <div className="text-center">
                        <p className="text-muted mb-2">Sistema ativo desde</p>
                        <h5 className="text-primary">{new Date().getFullYear()}</h5>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
            
            {/* Seção de Cursos */}
            <Card className="shadow-sm border-0 mt-4">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-book fs-3 text-primary me-3"></i>
                  <div>
                    <h4 className="mb-1">Cursos Disponíveis</h4>
                    <p className="text-muted mb-0">
                      {user.type === 'aluno' 
                        ? 'Explore e inscreva-se nos cursos oferecidos'
                        : 'Visualize os cursos disponíveis no sistema'
                      }
                    </p>
                  </div>
                </div>
                
                <CourseList userType={user.type} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;