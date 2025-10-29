<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=logfit_db", "root", "");
} catch(PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}

// Configurações do banco de dados
$host = 'localhost';     // Servidor do banco
$db   = 'logfit_db';    // Nome do banco
$user = 'root';         // Usuário
$pass = '';             // Senha
$charset = 'utf8mb4';   // Conjunto de caracteres

// String de conexão (DSN)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// Opções de configuração do PDO
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,    // Lança exceções em caso de erro
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,         // Retorna arrays associativos
    PDO::ATTR_EMULATE_PREPARES   => false,                    // Desativa preparação de statements emulada
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}

require_once 'conexao.php';

try {
    # Tenta executar uma query simples
    $stmt = $pdo->query('SELECT 1');
    echo "Conexão estabelecida com sucesso!";
    
    # Versão do servidor
    $versao = $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
    echo "\nVersão do MySQL: " . $versao;
    
} catch (PDOException $e) {
    die("Erro no teste de conexão: " . $e->getMessage());
}
?>