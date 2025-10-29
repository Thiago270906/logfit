<?php
session_start(); // Inicia a sessão para armazenar dados temporários entre páginas
require_once 'conexao.php'; // Inclui o arquivo que configura a conexão com o banco de dados

// Limpa mensagens de erro antigas para evitar exibir mensagens antigas ao usuário
unset($_SESSION['erro_login']);

// Verifica se o formulário foi enviado com os campos 'email' e 'password'
if (isset($_POST['email'], $_POST['password'])) {

    // Sanitiza o e-mail enviado para evitar caracteres indesejados
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    // Recebe a senha enviada no formulário (sem sanitização para não modificar)
    $senha = $_POST['password'];

    try {
        // Prepara uma consulta SQL para buscar o usuário pelo e-mail
        $sql = "SELECT id, nome, senha FROM usuarios WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]); // Executa a consulta passando o email para evitar SQL Injection

        // Busca o resultado da consulta (dados do usuário)
        $usuario = $stmt->fetch();

        // Verifica se o usuário existe e se a senha enviada corresponde com a senha criptografada no banco
        if ($usuario && password_verify($senha, $usuario['senha'])) {
            session_regenerate_id(true); // Regenera ID da sessão para segurança
            // Define uma variável de sessão indicando que o usuário está logado
            $_SESSION['usuario_logado'] = true;
            // Armazena dados do usuário na sessão para uso futuro
            $_SESSION['usuario'] = [
            'id' => $usuario['id'],
            'nome' => $usuario['nome']
            ];
            // Redireciona o usuário para a página principal após login bem-sucedido
            header('Location: index.php');
            exit;
        } else {
            // Caso a senha ou email estejam incorretos, seta mensagem de erro na sessão
            $_SESSION['erro_login'] = "Email ou senha inválidos";
            // Redireciona para a página de login para nova tentativa
            header('Location: index.php');
            exit;
        }
    } catch (PDOException $e) {
        // Caso ocorra algum erro no banco de dados, seta a mensagem genérica de erro
        $_SESSION['erro_login'] = "Erro ao processar login";
        // Redireciona para a página de login
        header('Location: index.php');
        exit;
    }
} else {
    // Se algum dos campos não foi preenchido, seta mensagem de erro na sessão
    $_SESSION['erro_login'] = "Por favor, preencha todos os campos";
    // Redireciona para a página de login
    header('Location: index.php');
    exit;
}
