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
CREATE TABLE rotina_dias (
    iddia INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rotina_id INT UNSIGNED NOT NULL,
    ordem_dia TINYINT UNSIGNED NOT NULL,
    dia_semana ENUM('Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo') NULL,
    foco VARCHAR(100) NOT NULL,
    FOREIGN KEY (rotina_id) REFERENCES rotinas_treino(idrotina) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 5. Tabela de Exercícios da Rotina
CREATE TABLE rotina_exercicios (
    idrotina_ex INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dia_id INT UNSIGNED NOT NULL,
    exercicio_id INT UNSIGNED NULL,
    nome_exercicio VARCHAR(100) NOT NULL,
    series SMALLINT UNSIGNED,
    repeticoes VARCHAR(20),
    descanso_seg SMALLINT UNSIGNED,
    FOREIGN KEY (dia_id) REFERENCES rotina_dias(iddia) ON DELETE CASCADE,
    FOREIGN KEY (exercicio_id) REFERENCES exercicios(idexercicio) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Tabela de Treinos dentro de uma Rotina
CREATE TABLE treinos (
    idtreino INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rotina_id INT UNSIGNED NOT NULL,
    ordem_dia TINYINT UNSIGNED NOT NULL,  -- Qual dia da rotina (1, 2, 3...)
    foco VARCHAR(100) NOT NULL,           -- Grupo muscular ou foco do treino
    FOREIGN KEY (rotina_id) REFERENCES rotinas_treino(idrotina) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 7. Tabela de Treinos Realizados (Histórico)
CREATE TABLE treinos_realizados (
    idtreino INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    rotina_id INT UNSIGNED NULL,
    data DATE NOT NULL,
    observacoes VARCHAR(350),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (rotina_id) REFERENCES rotinas_treino(idrotina) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Tabela de Exercícios feitos no Dia
CREATE TABLE detalhes_treino (
    iddetalhe INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    treino_id INT UNSIGNED NOT NULL,
    nome_exercicio VARCHAR(100) NOT NULL,
    series SMALLINT UNSIGNED,
    repeticoes VARCHAR(20),
    carga_kg DECIMAL(6,2),
    descanso_seg SMALLINT UNSIGNED,
    FOREIGN KEY (treino_id) REFERENCES treinos_realizados(idtreino) ON DELETE CASCADE
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