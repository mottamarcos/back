USE `193mobiledb`;

-- Tabela de Usuários
CREATE TABLE `Usuario` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(20),
    `tipo_usuario` ENUM('Admin', 'Operador', 'Militar', 'Usuário') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Autenticação
CREATE TABLE `Autenticacao` (
    `auth_id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NOT NULL,
    `tipo_autenticacao` ENUM('Login', 'Logout') NOT NULL,
    `credenciais` VARCHAR(255),
    `data_hora` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`user_id`) ON DELETE CASCADE
);

-- Tabela de Ocorrências
CREATE TABLE `Ocorrencia` (
    `ocorrencia_id` INT AUTO_INCREMENT PRIMARY KEY,
    `tipo_ocorrencia` VARCHAR(255) NOT NULL,
    `descricao` TEXT,
    `status` ENUM('Aberta', 'Em andamento', 'Concluída') DEFAULT 'Aberta',
    `localizacao` VARCHAR(255),
    `data_hora` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `usuario_id` INT NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`user_id`) ON DELETE CASCADE
);

CREATE TABLE `Equipe` (
    `equipe_id` INT PRIMARY KEY,
    `usuario_id` INT NOT NULL,
    `viatura_id` INT NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`user_id`) ON DELETE CASCADE
    FOREIGN KEY (`viatura_id`) REFERENCES `Viatura`(`viatura_id`) ON DELETE CASCADE
);

-- Tabela de Localizações
CREATE TABLE `Localizacao` (
    `localizacao_id` INT AUTO_INCREMENT PRIMARY KEY,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `data_hora` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `ocorrencia_id` INT NOT NULL,
    FOREIGN KEY (`ocorrencia_id`) REFERENCES `Ocorrencia`(`ocorrencia_id`) ON DELETE CASCADE
);

-- Tabela de Viaturas
CREATE TABLE `Viatura` (
    `viatura_id` INT AUTO_INCREMENT PRIMARY KEY,
    `tipo_viatura` VARCHAR(255) NOT NULL,
    `placa` VARCHAR(20) UNIQUE NOT NULL,
    `status` ENUM('Disponível', 'Em operação', 'Manutenção') DEFAULT 'Disponível',
    `localizacao_atual` VARCHAR(255)
);

-- Tabela de Atendimentos
CREATE TABLE `Atendimento` (
    `atendimento_id` INT AUTO_INCREMENT PRIMARY KEY,
    `ocorrencia_id` INT NOT NULL,
    `viatura_id` INT NOT NULL,
    `data_hora_inicio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `data_hora_conclusao` TIMESTAMP,
    `detalhes` TEXT,
    FOREIGN KEY (`ocorrencia_id`) REFERENCES `Ocorrencia`(`ocorrencia_id`) ON DELETE CASCADE,
    FOREIGN KEY (`viatura_id`) REFERENCES `Viatura`(`viatura_id`) ON DELETE CASCADE
);

-- Tabela de Notificações
CREATE TABLE `Notificacao` (
    `notificacao_id` INT AUTO_INCREMENT PRIMARY KEY,
    `tipo_notificacao` VARCHAR(255) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `usuario_id` INT NOT NULL,
    `ocorrencia_id` INT,
    `data_hora` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`ocorrencia_id`) REFERENCES `Ocorrencia`(`ocorrencia_id`) ON DELETE CASCADE
);

-- Tabela de Chats
CREATE TABLE `Chat` (
    `chat_id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario_origem_id` INT NOT NULL,
    `usuario_destino_id` INT NOT NULL,
    `mensagem` TEXT NOT NULL,
    `ocorrencia_id` INT,
    `data_hora` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`usuario_origem_id`) REFERENCES `Usuario`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`usuario_destino_id`) REFERENCES `Usuario`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`ocorrencia_id`) REFERENCES `Ocorrencia`(`ocorrencia_id`) ON DELETE CASCADE
);
