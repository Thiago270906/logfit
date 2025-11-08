-- Criação do Banco de Dados
CREATE DATABASE logfit_db;
USE logfit_db;

-- 1. Tabela de Usuários (Mantida como base)
CREATE TABLE usuarios (
    idusuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    idade int,
    peso_inicial DECIMAL(5, 2),
    altura_cm SMALLINT UNSIGNED,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela de Catálogo de Exercícios
CREATE TABLE exercicios (
    idexercicio INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    grupo_muscular VARCHAR(50)
) ENGINE=InnoDB;

-- 3. Tabela de Rotina de Treino
CREATE TABLE rotinas_treino (
    idrotina INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    nome VARCHAR(100) NOT NULL,
    dias_semana TINYINT UNSIGNED NOT NULL,
    duracao_semanas TINYINT UNSIGNED NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativa TINYINT(1) DEFAULT 1, -- Rotina ativa no momento
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabela de Dias de Treino dentro da Rotina
CREATE TABLE treinos (
    idtreino INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    nome VARCHAR(100) NOT NULL,
    dia_semana ENUM('Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo') NULL,
    descanso_padrao_seg SMALLINT UNSIGNED DEFAULT 60,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 5. Tabela de Exercícios da Rotina
CREATE TABLE treino_exercicios (
    idtreino_ex INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    treino_id INT UNSIGNED NOT NULL,
    exercicio_id INT UNSIGNED NULL,
    nome_exercicio VARCHAR(100) NOT NULL,
    series SMALLINT UNSIGNED,
    repeticoes VARCHAR(20),
    carga_kg DECIMAL(6,2),
    descanso_seg SMALLINT UNSIGNED,
    FOREIGN KEY (treino_id) REFERENCES treinos(idtreino) ON DELETE CASCADE,
    FOREIGN KEY (exercicio_id) REFERENCES exercicios(idexercicio) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Tabela de Treinos dentro de uma Rotina
CREATE TABLE rotina_treinos (
    idrotina_treino INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rotina_id INT UNSIGNED NOT NULL,
    treino_id INT UNSIGNED NOT NULL,
    ordem_dia TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY (rotina_id) REFERENCES rotinas_treino(idrotina) ON DELETE CASCADE,
    FOREIGN KEY (treino_id) REFERENCES treinos(idtreino) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 7. Tabela de Treinos Realizados (Histórico)
CREATE TABLE treinos_realizados (
    idtreino_real INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    treino_id INT UNSIGNED NULL,
    data DATE NOT NULL,
    observacoes VARCHAR(350),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (treino_id) REFERENCES treinos(idtreino) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Tabela de Exercícios feitos no Dia
CREATE TABLE detalhes_treino (
    iddetalhe INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    treino_real_id INT UNSIGNED NOT NULL,
    nome_exercicio VARCHAR(100) NOT NULL,
    series SMALLINT UNSIGNED,
    repeticoes VARCHAR(20),
    carga_kg DECIMAL(6,2),
    descanso_seg SMALLINT UNSIGNED,
    FOREIGN KEY (treino_real_id) REFERENCES treinos_realizados(idtreino_real) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Tabela de Dietas
CREATE TABLE dietas (
    iddieta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    nome_dieta VARCHAR(100) NOT NULL,
    kcal_total INT UNSIGNED NOT NULL,
    agua_ml INT UNSIGNED NOT NULL,
    cafe_manha TEXT,
    lanche_manha TEXT,
    almoco TEXT,
    lanche_tarde TEXT,
    janta TEXT,
    ceia TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Tabela de Progresso
CREATE TABLE progresso (
    idprogresso INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    data DATE NOT NULL,
    peso_kg DECIMAL(5, 2) NOT NULL,
    observacoes TEXT,
    UNIQUE KEY uk_data_usuario (usuario_id, data),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO exercicios (nome, grupo_muscular) VALUES
-- PEITO (8)
('Supino Reto com Barra', 'Peito'),
('Supino Declinado com Barra', 'Peito'),
('Supino Máquina', 'Peito'),
('Crucifixo com Máquina', 'Peito'),
('Cross Over na Polia', 'Peito'),
('Supino com Halteres', 'Peito'),
('Supino Inclinado com Halteres', 'Peito'),
('Flexão de Braço', 'Peito'),

-- COSTAS (15)
('Barra Fixa', 'Costas'),
('Puxada na Frente (Pulley)', 'Costas'),
('Remada Baixa', 'Costas'),
('Remada Curvada com Barra', 'Costas'),
('Remada com Haltere Unilateral', 'Costas'),
('Remada Cavalinho Máquina', 'Costas'),
('Remada Unilateral Máquina', 'Costas'),
('Levantamento Terra', 'Costas'),
('Puldow na Polia', 'Costas'),
('Puxada Neutra', 'Costas'),
('Remada Alta na Polia', 'Costas'),
('Face Pull', 'Costas'),

-- PERNAS
-- Quadríceps (8)
('Agachamento Livre', 'Quadríceps'),
('Leg Press', 'Quadríceps'),
('Cadeira Extensora', 'Quadríceps'),
('Agachamento no Smith', 'Quadríceps'),
('Agachamento Búlgaro', 'Quadríceps'),
('Avanço (Lunge)', 'Quadríceps'),
('Hack Machine', 'Quadríceps'),
('Adutor de Quadril na Máquina', 'Quadríceps'),

-- Posterior (8)
('Stiff com Barra', 'Posterior'),
('Stiff com Halteres', 'Posterior'),
('Mesa Flexora', 'Posterior'),
('Cadeira Flexora', 'Posterior'),
('Levantamento Terra Romeno', 'Posterior'),

-- Glúteos (4)
('Elevação Pélvica (Glúteo)', 'Glúteos'),
('Glúteo no Cabo', 'Glúteos'),
('Agachamento Sumô com Halteres', 'Glúteos'),
('Abdução de Quadril na Máquina', 'Glúteos'),

-- Panturrilha (3)
('Panturrilha no Leg', 'Panturrilha'),
('Panturrilha em Pé', 'Panturrilha'),
('Panturrilha Sentado', 'Panturrilha'),

-- OMBROS (8)
('Desenvolvimento com Halteres', 'Ombros'),
('Desenvolvimento Máquina', 'Ombros'),
('Elevação Lateral', 'Ombros'),
('Elevação Lateral no Cabo', 'Ombros'),
('Elevação Frontal', 'Ombros'),
('Elevação Frontal no Cabo', 'Ombros'),
('Posterior no Cabo', 'Ombros'),
('Crucifixo Invertido', 'Ombros'),

-- BÍCEPS (7)
('Rosca Direta', 'Bíceps'),
('Rosca Alternada', 'Bíceps'),
('Rosca Martelo', 'Bíceps'),
('Rosca Concentrada', 'Bíceps'),
('Rosca Scott', 'Bíceps'),
('Rosca Inclinada com Halteres', 'Bíceps'),
('Rosca no Cabo', 'Bíceps'),

-- TRÍCEPS (7)
('Tríceps Pulley', 'Tríceps'),
('Tríceps Corda', 'Tríceps'),
('Tríceps Testa', 'Tríceps'),
('Tríceps Francês', 'Tríceps'),
('Tríceps Testa no Cabo', 'Tríceps'),
('Tríceps Francês no Cabo', 'Tríceps'),
('Mergulho em Paralelas', 'Tríceps'),

-- ABDOME (3)
('Crunch Abdominal', 'Abdômen'),
('Prancha', 'Abdômen'),
('Elevação de Pernas Infra', 'Abdômen');