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
('Administrador', 'admin@plataforma.com', 'admin', '$2b$10$vYGbpC3BhDv2KS2/LpdxqOhyb4Dccuxn79NYHp.dJkeYK7sKpxtd2', 'admin'),
('Professor Teste', 'professor@plataforma.com', 'professor', '$2b$10$vYGbpC3BhDv2KS2/LpdxqOhyb4Dccuxn79NYHp.dJkeYK7sKpxtd2', 'professor'),
('Aluno Teste', 'aluno@plataforma.com', 'aluno', '$2b$10$vYGbpC3BhDv2KS2/LpdxqOhyb4Dccuxn79NYHp.dJkeYK7sKpxtd2', 'aluno');

INSERT IGNORE INTO courses (name, description, cover, startDate, endDate) VALUES 
('Desenvolvimento Full Stack com Node.js', 'Curso completo de desenvolvimento web usando Node.js, Express e MongoDB. Aprenda a criar aplicações do zero.', 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg', '2024-01-15', '2024-04-15'),
('TypeScript para Desenvolvedores', 'Domine TypeScript e leve suas habilidades de JavaScript para o próximo nível com tipagem estática.', 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg', '2024-02-01', '2024-05-01'),
('React: Do Básico ao Avançado', 'Aprenda React desde os conceitos fundamentais até patterns avançados e otimização de performance.', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg', '2024-02-15', '2024-05-15'),
('Python para Data Science', 'Utilize Python para análise de dados, machine learning e visualização com pandas, numpy e matplotlib.', 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg', '2024-03-01', '2024-06-01'),
('Design Thinking e UX/UI', 'Metodologias de design centrado no usuário para criar experiências digitais excepcionais.', 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg', '2024-03-15', '2024-06-15'),
('DevOps com Docker e Kubernetes', 'Containerização, orquestração e deploy de aplicações usando Docker e Kubernetes.', 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg', '2024-04-01', '2024-07-01'),
('Machine Learning com Python', 'Introdução ao aprendizado de máquina usando scikit-learn, TensorFlow e Keras.', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg', '2024-04-15', '2024-07-15'),
('Cybersecurity Fundamentals', 'Princípios essenciais de segurança da informação e proteção de sistemas.', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg', '2024-05-01', '2024-08-01'),
('Mobile Development com React Native', 'Desenvolvimento de aplicativos móveis multiplataforma usando React Native.', 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg', '2024-05-15', '2024-08-15'),
('Cloud Computing com AWS', 'Fundamentos de computação em nuvem usando Amazon Web Services.', 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg', '2024-06-01', '2024-09-01'),
('Git e GitHub para Equipes', 'Controle de versão avançado e colaboração em projetos de software.', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg', '2024-06-15', '2024-09-15'),
('Banco de Dados SQL e NoSQL', 'Modelagem e consultas em bancos relacionais e não-relacionais.', 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg', '2024-07-01', '2024-10-01'),
('Arquitetura de Software', 'Padrões arquiteturais, clean code e princípios SOLID para sistemas escaláveis.', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg', '2024-07-15', '2024-10-15'),
('Testing e Quality Assurance', 'Testes automatizados, TDD e estratégias de qualidade de software.', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', '2024-08-01', '2024-11-01'),
('Blockchain e Criptomoedas', 'Tecnologia blockchain, smart contracts e desenvolvimento de DApps.', 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg', '2024-08-15', '2024-11-15'),
('Inteligência Artificial Generativa', 'GPT, ChatGPT e ferramentas de IA para desenvolvimento e produtividade.', 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg', '2024-09-01', '2024-12-01'),
('E-commerce com Shopify', 'Criação e customização de lojas virtuais usando Shopify e Liquid.', 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg', '2024-09-15', '2024-12-15'),
('Marketing Digital para Desenvolvedores', 'SEO, analytics e estratégias de marketing para produtos digitais.', 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg', '2024-10-01', '2025-01-01'),
('Gestão de Projetos Ágeis', 'Scrum, Kanban e metodologias ágeis para gestão de projetos de tecnologia.', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', '2024-10-15', '2025-01-15'),
('Empreendedorismo Tech', 'Como criar e lançar startups de tecnologia, desde a ideia até o MVP.', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', '2024-11-01', '2025-02-01'),
('Flutter para Desenvolvimento Mobile', 'Crie aplicativos nativos para iOS e Android usando o framework Flutter do Google.', 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg', '2024-11-15', '2025-02-15'),
('Vue.js: Framework Progressivo', 'Aprenda Vue.js do básico ao avançado para criar interfaces de usuário reativas.', 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg', '2024-12-01', '2025-03-01'),
('Angular: Desenvolvimento Enterprise', 'Framework robusto para aplicações web corporativas usando TypeScript.', 'https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg', '2024-12-15', '2025-03-15'),
('PHP e Laravel para Web', 'Desenvolvimento web moderno com PHP e o framework Laravel.', 'https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg', '2025-01-01', '2025-04-01'),
('Java Spring Boot', 'Desenvolvimento de APIs REST robustas com Java e Spring Boot.', 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg', '2025-01-15', '2025-04-15'),
('C# e .NET Core', 'Programação orientada a objetos e desenvolvimento web com .NET Core.', 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg', '2025-02-01', '2025-05-01'),
('Go (Golang) para Backend', 'Linguagem moderna do Google para sistemas distribuídos e APIs performáticas.', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg', '2025-02-15', '2025-05-15'),
('Rust: Programação de Sistemas', 'Linguagem de programação de sistemas com foco em performance e segurança.', 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg', '2025-03-01', '2025-06-01'),
('Next.js: React para Produção', 'Framework React para aplicações web em produção com SSR e SSG.', 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg', '2025-03-15', '2025-06-15'),
('Svelte e SvelteKit', 'Framework moderno e rápido para desenvolvimento web sem virtual DOM.', 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg', '2025-04-01', '2025-07-01'),
('GraphQL: API Moderna', 'Query language para APIs mais eficientes e flexíveis que REST.', 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg', '2025-04-15', '2025-07-15'),
('Microserviços com Node.js', 'Arquitetura de microserviços usando Node.js, Docker e Kubernetes.', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', '2025-05-01', '2025-08-01'),
('Unity para Desenvolvimento de Jogos', 'Criação de jogos 2D e 3D usando a engine Unity com C#.', 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg', '2025-05-15', '2025-08-15'),
('Unreal Engine: Jogos AAA', 'Desenvolvimento de jogos profissionais com Unreal Engine e Blueprints.', 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg', '2025-06-01', '2025-09-01'),
('Electron: Apps Desktop', 'Desenvolvimento de aplicações desktop usando tecnologias web.', 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg', '2025-06-15', '2025-09-15'),
('Redis e Cache Strategies', 'Otimização de performance com Redis e estratégias de cache avançadas.', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg', '2025-07-01', '2025-10-01'),
('Elasticsearch e Busca', 'Mecanismos de busca avançados com Elasticsearch e Kibana.', 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg', '2025-07-15', '2025-10-15'),
('Apache Kafka e Streaming', 'Processamento de dados em tempo real com Apache Kafka.', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg', '2025-08-01', '2025-11-01'),
('Ethical Hacking e Pentest', 'Testes de penetração e hacking ético para identificar vulnerabilidades.', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg', '2025-08-15', '2025-11-15'),
('Automação com Python', 'Scripts e automação de tarefas usando Python para produtividade.', 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg', '2025-09-01', '2025-12-01');

INSERT IGNORE INTO enrollments (enrollDate, conclusionDate, userId, courseId, status) VALUES 
('2024-01-10 10:00:00', NULL, 3, 1, 'in_progress'),
('2024-01-20 14:30:00', '2024-03-10 16:45:00', 3, 2, 'concluded'),
('2024-02-05 09:15:00', NULL, 2, 1, 'in_progress');