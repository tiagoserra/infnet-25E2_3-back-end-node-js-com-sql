import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { Container, Alert } from 'react-bootstrap';
import Navbar from './Navbar';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.type !== 'admin') {
    return (
      <>
        <Navbar />
        <Container className="mt-4">
          <Alert variant="danger">
            <Alert.Heading>Acesso Negado</Alert.Heading>
            <p>Você não tem permissão para acessar esta página. Apenas administradores podem acessar esta área.</p>
          </Alert>
        </Container>
      </>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;