import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  InputGroup, 
  Modal, 
  Alert,
  Badge,
  Spinner
} from 'react-bootstrap';
import Navbar from './Navbar';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  type: 'aluno' | 'professor' | 'admin';
}

interface UserFormData {
  name: string;
  email: string;
  login: string;
  password: string;
  type: 'aluno' | 'professor' | 'admin';
}

const UserAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    login: '',
    password: '',
    type: 'aluno'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users?search=${searchTerm}`);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setAlert({ type: 'danger', message: 'Erro ao carregar usuários' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', formData);
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Usuário criado com sucesso!' });
        setShowCreateModal(false);
        setFormData({ name: '', email: '', login: '', password: '', type: 'aluno' });
        fetchUsers();
      }
    } catch (error: any) {
      setAlert({ 
        type: 'danger', 
        message: error.response?.data?.message || 'Erro ao criar usuário' 
      });
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await api.put(`/users/${selectedUser.id}`, updateData);
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Usuário atualizado com sucesso!' });
        setShowEditModal(false);
        setSelectedUser(null);
        setFormData({ name: '', email: '', login: '', password: '', type: 'aluno' });
        fetchUsers();
      }
    } catch (error: any) {
      setAlert({ 
        type: 'danger', 
        message: error.response?.data?.message || 'Erro ao atualizar usuário' 
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.delete(`/users/${selectedUser.id}`);
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Usuário excluído com sucesso!' });
        setShowDeleteModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error: any) {
      setAlert({ 
        type: 'danger', 
        message: error.response?.data?.message || 'Erro ao excluir usuário' 
      });
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      login: user.login,
      password: '',
      type: user.type
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'admin': return 'danger';
      case 'professor': return 'warning';
      case 'aluno': return 'primary';
      default: return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'admin': return 'Administrador';
      case 'professor': return 'Professor';
      case 'aluno': return 'Aluno';
      default: return type;
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Administração de Usuários
                </h4>
                <Button 
                  variant="success" 
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Novo Usuário
                </Button>
              </Card.Header>
              <Card.Body>
                {alert && (
                  <Alert 
                    variant={alert.type} 
                    dismissible 
                    onClose={() => setAlert(null)}
                  >
                    {alert.message}
                  </Alert>
                )}

                <Row className="mb-3">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                </Row>

                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                    <p className="mt-2">Carregando usuários...</p>
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Login</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <i className="bi bi-inbox display-6 text-muted"></i>
                            <p className="text-muted mt-2">Nenhum usuário encontrado</p>
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.login}</td>
                            <td>
                              <Badge bg={getTypeVariant(user.type)}>
                                {getTypeLabel(user.type)}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => openEditModal(user)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => openDeleteModal(user)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal de Criação */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Novo Usuário</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateUser}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.login}
                      onChange={(e) => setFormData({...formData, login: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Usuário</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'aluno' | 'professor' | 'admin'})}
                >
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Criar Usuário
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal de Edição */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuário</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleEditUser}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.login}
                      onChange={(e) => setFormData({...formData, login: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nova Senha (deixe em branco para manter)</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Digite uma nova senha ou deixe em branco"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Usuário</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'aluno' | 'professor' | 'admin'})}
                >
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Alterações
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal de Exclusão */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?</p>
            <p className="text-muted">Esta ação não pode ser desfeita.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default UserAdmin;