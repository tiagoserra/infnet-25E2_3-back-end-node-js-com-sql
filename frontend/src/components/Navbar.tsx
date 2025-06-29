import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <BSNavbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <BSNavbar.Brand href="/home" className="fw-bold">
          <i className="bi bi-mortarboard me-2"></i>
          Sistema Acadêmico
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home" className="fw-semibold">
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>
            {user && user.type === 'aluno' && (
              <Nav.Link href="/my-courses" className="fw-semibold">
                <i className="bi bi-journal-bookmark me-1"></i>
                Meus Cursos
              </Nav.Link>
            )}
            {user && user.type === 'admin' && (
              <Nav.Link href="/admin/users" className="fw-semibold">
                <i className="bi bi-people me-1"></i>
                Gerenciar Usuários
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center">
            {user && (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="outline-light" 
                    id="dropdown-user"
                    className="border-0 shadow-none"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {user.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <div className="fw-bold">{user.name}</div>
                      <small className="text-muted">{user.email}</small>
                    </Dropdown.Header>

                    <Dropdown.Divider />
                    
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Sair
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;