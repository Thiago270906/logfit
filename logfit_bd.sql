	-- Criação do Banco de Dados
	DROP DATABASE logfit_db;
	CREATE DATABASE logfit_db;
	USE logfit_db;

	-- 1. Tabela de Usuários (Mantida como base)
	CREATE TABLE usuarios (
		idusuario INT AUTO_INCREMENT PRIMARY KEY,
		nome VARCHAR(100) NOT NULL,
		email VARCHAR(100) NOT NULL UNIQUE,
		senha VARCHAR(255) NOT NULL,
        tipo ENUM('administrador','usuario'),
		idade int,
		peso_inicial DECIMAL(5, 2),
		altura_cm SMALLINT,
		data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- 2. Tabela de Catálogo de Exercícios
	CREATE TABLE exercicios (
		idexercicio INT AUTO_INCREMENT PRIMARY KEY,
		nome VARCHAR(100) NOT NULL UNIQUE,
		grupo_muscular VARCHAR(50)
	);

	-- 3. Tabela de Rotina de Treino
	CREATE TABLE rotinas (
		idrotina INT AUTO_INCREMENT PRIMARY KEY,
		idusuario INT NOT NULL,
		nome VARCHAR(100) NOT NULL,
		data_inicio DATE NOT NULL,
		data_fim DATE,
		data_ativacao DATETIME,
		ativa TINYINT(1) DEFAULT 1, -- Rotina ativa no momento
		FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE
	);

	-- 4. Tabela de Dias de Treino dentro da Rotina
	CREATE TABLE treinos (
		idtreino INT AUTO_INCREMENT PRIMARY KEY,
		idusuario INT NOT NULL,
		nome VARCHAR(100) NOT NULL,
		dia_semana ENUM('Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo') NULL,
		data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE
	);


	-- 5. Tabela de Exercícios da Rotina
	CREATE TABLE treino_exercicios (
		idtreino_ex INT AUTO_INCREMENT PRIMARY KEY,
		idtreino INT NOT NULL,
		idexercicio INT NULL,
		series SMALLINT,
		repeticoes VARCHAR(20),
		carga_kg DECIMAL(6,2),
		descanso_seg SMALLINT,
		observacao text,
		FOREIGN KEY (idtreino) REFERENCES treinos(idtreino) ON DELETE CASCADE,
		FOREIGN KEY (idexercicio) REFERENCES exercicios(idexercicio) ON DELETE SET NULL
	);

	-- 6. Tabela de Treinos dentro de uma Rotina
	CREATE TABLE rotina_treinos (
		idrotina_treino INT AUTO_INCREMENT PRIMARY KEY,
		idrotina INT NOT NULL,
		idtreino INT NOT NULL,
		FOREIGN KEY (idrotina) REFERENCES rotinas(idrotina) ON DELETE CASCADE,
		FOREIGN KEY (idtreino) REFERENCES treinos(idtreino) ON DELETE CASCADE
	);

	-- 7. Tabela Refeição
	CREATE TABLE refeicoes (
		idrefeicao INT AUTO_INCREMENT PRIMARY KEY,
		nome VARCHAR(100) NOT NULL,usuarios
		kcal DECIMAL(7, 2) NOT NULL
	);

	-- 8. Tabela Opção
	CREATE TABLE opcoes (
		idopcao INT AUTO_INCREMENT PRIMARY KEY,
		idrefeicao INT NOT NULL,
		quantidade DECIMAL NOT NULL,
		kcal_opcao Decimal(7,2) NOT NULL,
		tipo ENUM('Café da Manhã','Lanche da Manhã','Almoço','Lanche da Tarde','Pós Treino','Janta','Ceia') NOT NULL,
		FOREIGN KEY (idrefeicao) REFERENCES refeicoes(idrefeicao) ON DELETE CASCADE
	);

	-- 9. Tabela de Dietas
	CREATE TABLE dietas (
		iddieta INT AUTO_INCREMENT PRIMARY KEY,
		idusuario INT NOT NULL,
		idopcao INT NOT NULL,
		nome_dieta VARCHAR(100) NOT NULL,
		kcal_total DECIMAL(7,2) NOT NULL,
		agua_ml INT NOT NULL,
		data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE,
		FOREIGN KEY (idopcao) REFERENCES opcoes(idopcao) ON DELETE CASCADE
	);

	-- 11. Tabela de Progresso
	CREATE TABLE acompanhamentos (
		idacompanhamento INT AUTO_INCREMENT PRIMARY KEY,
		idusuario INT NOT NULL,
		data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
		peso_kg DECIMAL(5, 2) NOT NULL,
		observacoes TEXT,
		FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE
	);

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