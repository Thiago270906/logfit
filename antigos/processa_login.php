<?php
session_start();
require_once 'conexao.php';

// Limpa mensagens anteriores
unset($_SESSION['erro_login']);

// Verifica CSRF
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    $_SESSION['erro_login'] = "Token inválido, tente novamente.";
    header("Location: login.php");
    exit;
}

// Verifica campos
if (empty($_POST['email']) || empty($_POST['password'])) {
    $_SESSION['erro_login'] = "Preencha todos os campos.";
    header("Location: login.php");
    exit;
}

$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$senha = $_POST['password'];

try {
    // Busca usuário no banco
    $sql = "SELECT idusuario, nome, senha FROM usuarios WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        // Verifica senha
        if (password_verify($senha, $usuario['senha'])) {

            session_regenerate_id(true);

            $_SESSION['usuario_logado'] = true;
            $_SESSION['usuario'] = [
                'id' => $usuario['idusuario'],
                'nome' => $usuario['nome']
            ];

            header("Location: index.php");
            exit;
        }
    }

    $_SESSION['erro_login'] = "Email ou senha incorretos.";
    header("Location: login.php");
    exit;

} catch (PDOException $e) {
    $_SESSION['erro_login'] = "Erro ao processar login.";
    header("Location: login.php");
    exit;
}
