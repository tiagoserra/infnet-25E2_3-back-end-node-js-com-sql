-- Script de inicialização do banco de dados
-- Este arquivo será executado automaticamente na primeira inicialização do MySQL

USE plataforma_cursos;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    login VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('aluno', 'professor', 'admin') DEFAULT 'aluno'
);

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cover VARCHAR(255),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enrollDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    conclusionDate DATETIME NULL,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    status ENUM('in_progress', 'concluded', 'canceled', 'fail') DEFAULT 'in_progress',
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (courseId) REFERENCES courses(id),
    UNIQUE KEY unique_enrollment (userId, courseId)
);

-- Inserir dados iniciais (opcional)
INSERT IGNORE INTO users (name, email, login, password, type) VALUES 
('Administrador', 'admin@plataforma.com', 'admin', '$2b$10$example_hash', 'admin'),
('Professor Teste', 'professor@plataforma.com', 'professor', '$2b$10$example_hash', 'professor'),
('Aluno Teste', 'aluno@plataforma.com', 'aluno', '$2b$10$example_hash', 'aluno');

INSERT IGNORE INTO courses (name, description, cover, startDate, endDate) VALUES 
('Curso de Node.js', 'Aprenda desenvolvimento backend com Node.js', 'nodejs-cover.jpg', '2024-01-15', '2024-03-15'),
('Curso de TypeScript', 'Dominando TypeScript para desenvolvimento web', 'typescript-cover.jpg', '2024-02-01', '2024-04-01');

INSERT IGNORE INTO enrollments (enrollDate, conclusionDate, userId, courseId, status) VALUES 
('2024-01-10 10:00:00', NULL, 3, 1, 'in_progress'),
('2024-01-20 14:30:00', '2024-03-10 16:45:00', 3, 2, 'concluded'),
('2024-02-05 09:15:00', NULL, 2, 1, 'in_progress');