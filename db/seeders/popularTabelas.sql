START TRANSACTION

-- Tabela de Usuários
INSERT INTO `Usuario` (`nome`, `email`, `senha`, `telefone`, `tipo_usuario`) VALUES
('João Silva', 'joao.silva@example.com', 'senha123', '11987654321', 'Admin'),
('Maria Oliveira', 'maria.oliveira@example.com', 'senha456', '11998765432', 'Operador'),
('Carlos Souza', 'carlos.souza@example.com', 'senha789', '11987654322', 'Militar'),
('Ana Costa', 'ana.costa@example.com', 'senha012', '11987654323', 'Vítima');

-- Tabela de Autenticação
INSERT INTO `Autenticacao` (`usuario_id`, `tipo_autenticacao`, `credenciais`, `data_hora`) VALUES
(1, 'Login', 'Login realizado com sucesso', NOW()),
(2, 'Logout', 'Logout realizado com sucesso', NOW()),
(3, 'Login', 'Login realizado com sucesso', NOW());

-- Tabela de Ocorrências
INSERT INTO `Ocorrencia` (`tipo_ocorrencia`, `descricao`, `status`, `localizacao`, `usuario_id`) VALUES
('Acidente de trânsito', 'Colisão frontal entre dois veículos na Avenida Brasil', 'Aberta', 'Avenida Brasil, 5000', 1),
('Roubo', 'Roubo a comércio, valor de aproximadamente 5000 reais', 'Em andamento', 'Rua das Flores, 250', 2),
('Incêndio', 'Incêndio em residência de dois andares', 'Concluída', 'Rua do Sol, 100', 3);


-- Tabela de Localizações
INSERT INTO `Localizacao` (`latitude`, `longitude`, `ocorrencia_id`) VALUES
(-23.550520, -46.633308, 1),
(-23.551920, -46.631309, 2),
(-23.552320, -46.634509, 3);


-- Tabela de Viaturas
INSERT INTO `Viatura` (`tipo_viatura`, `placa`, `status`, `localizacao_atual`) VALUES
('Ambulância', 'ABC1234', 'Disponível', 'Avenida Brasil, 5000'),
('Viatura policial', 'XYZ9876', 'Em operação', 'Rua das Flores, 250'),
('Bombeiro', 'DEF4321', 'Em operação', 'Rua do Sol, 100');

-- Tabela de Atendimentos
INSERT INTO `Atendimento` (`ocorrencia_id`, `viatura_id`, `data_hora_inicio`, `data_hora_conclusao`, `detalhes`) VALUES
(1, 1, NOW(), NOW(), 'Atendimento ao acidente com encaminhamento de vítimas ao hospital.'),
(2, 2, NOW(), NULL, 'Realizando patrulhamento na área do roubo, aguardando novas informações.'),
(3, 3, NOW(), NOW(), 'Combate ao incêndio, vítimas resgatadas e encaminhadas ao hospital.');


-- Tabela de Notificações
INSERT INTO `Notificacao` (`tipo_notificacao`, `mensagem`, `usuario_id`, `ocorrencia_id`) VALUES
('Alerta de novo incidente', 'Novo acidente de trânsito na Avenida Brasil. Atender imediatamente.', 1, 1),
('Aviso de progresso', 'Ocorrência de roubo está sendo monitorada e em andamento.', 2, 2),
('Conclusão de caso', 'Incêndio na Rua do Sol foi controlado e vítimas resgatadas.', 3, 3);


-- Tabela de Chats
INSERT INTO `Chat` (`usuario_origem_id`, `usuario_destino_id`, `mensagem`, `ocorrencia_id`) VALUES
(1, 2, 'Qual a situação na Avenida Brasil?', 1),
(2, 1, 'Estamos no local, aguardando apoio. Atualizo em breve.', 1),
(3, 4, 'O incêndio foi controlado, você está bem?', 3);
