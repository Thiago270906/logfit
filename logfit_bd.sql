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

-- 3. Tabela de Sessões de Treino
CREATE TABLE sessoes_treino (
    idsessao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    data DATE NOT NULL,
    titulo VARCHAR(100),
    duracao_min SMALLINT UNSIGNED,
    observacoes varchar(350),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;
-- 4 Tabela de Detalhes
CREATE TABLE detalhes_sessao (
    iddetalhe INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sessao_id INT UNSIGNED NOT NULL,
    exercicio_id INT UNSIGNED NOT NULL,
    serie SMALLINT UNSIGNED NOT NULL,
    repeticoes SMALLINT UNSIGNED,
    carga_kg DECIMAL(6, 2),
    descanso_seg SMALLINT UNSIGNED,
    FOREIGN KEY (sessao_id) REFERENCES sessoes_treino(idsessao) ON DELETE CASCADE,
    FOREIGN KEY (exercicio_id) REFERENCES exercicios(idexercicio) ON DELETE RESTRICT 
) ENGINE=InnoDB;

-- 5. Tabela de Log Diário de Nutrição
CREATE TABLE log_nutricao (
    idlog_nutricao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    data DATE NOT NULL,
    descricao_dieta TEXT NOT NULL,
    kcal_total INT UNSIGNED,
    agua_ml INT UNSIGNED,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabela de Alarmes
CREATE TABLE alarmes (
    idalarme INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    tipo ENUM('Acordar', 'Treino', 'Refeicao', 'Outro') NOT NULL,
    titulo VARCHAR(100),
    horario TIME NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Tabela de Progresso
CREATE TABLE progresso (
    idprogresso INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    data DATE NOT NULL,
    peso_kg DECIMAL(5, 2) NOT NULL,
    observacoes TEXT,
    UNIQUE KEY uk_data_usuario (usuario_id, data),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE
) ENGINE=InnoDB;