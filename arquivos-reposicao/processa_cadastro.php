<?php
session_start();
require_once 'conexao.php'; // Conexão PDO

// Função para validar os dados
function validarDados($dados) {
    $erros = [];

    // Nome com no mínimo 3 caracteres
    if (strlen(trim($dados['nome'])) < 3) {
        $erros[] = "Nome deve ter no mínimo 3 caracteres.";
    }

    // E-mail válido
    if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        $erros[] = "E-mail inválido.";
    }

    // Senha com no mínimo 8 caracteres
    if (strlen($dados['senha']) < 8) {
        $erros[] = "Senha deve ter no mínimo 8 caracteres.";
    }

    // Confirmação de senha
    if ($dados['senha'] !== $dados['confirma_senha']) {
        $erros[] = "As senhas não conferem.";
    }

    // Idade válida (opcional)
    if (!empty($dados['idade']) && (!is_numeric($dados['idade']) || $dados['idade'] < 0 || $dados['idade'] > 150)) {
        $erros[] = "Idade inválida.";
    }

    // Peso inicial válido (opcional)
    if (!empty($dados['peso_inicial']) && (!is_numeric($dados['peso_inicial']) || $dados['peso_inicial'] <= 0)) {
        $erros[] = "Peso inicial inválido.";
    }

    // Altura válida (opcional)
    if (!empty($dados['altura_cm']) && (!is_numeric($dados['altura_cm']) || $dados['altura_cm'] <= 0)) {
        $erros[] = "Altura inválida.";
    }

    return $erros;
}

// Executa apenas se for método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $erros = validarDados($_POST);

    if (empty($erros)) {
        try {
            // Verifica se o e-mail já está cadastrado
            $stmt = $pdo->prepare("SELECT idusuario FROM usuarios WHERE email = ?");
            $stmt->execute([trim($_POST['email'])]);

            if ($stmt->rowCount() > 0) {
                $_SESSION['erro_cadastro'] = "Este e-mail já está cadastrado.";
                header('Location: cadastro.php');
                exit;
            }

            // Insere o usuário
            $sql = "INSERT INTO usuarios (nome, email, senha, idade, peso_inicial, altura_cm)
                    VALUES (:nome, :email, :senha, :idade, :peso_inicial, :altura_cm)";
            $stmt = $pdo->prepare($sql);

            $stmt->bindValue(':nome', trim($_POST['nome']));
            $stmt->bindValue(':email', trim($_POST['email']));
            $stmt->bindValue(':senha', password_hash($_POST['senha'], PASSWORD_DEFAULT));
            $stmt->bindValue(':idade', !empty($_POST['idade']) ? (int)$_POST['idade'] : null, PDO::PARAM_INT);
            $stmt->bindValue(':peso_inicial', !empty($_POST['peso_inicial']) ? (float)$_POST['peso_inicial'] : null);
            $stmt->bindValue(':altura_cm', !empty($_POST['altura_cm']) ? (int)$_POST['altura_cm'] : null, PDO::PARAM_INT);

            $stmt->execute();

            $_SESSION['sucesso_cadastro'] = "Cadastro realizado com sucesso!";
            header('Location: login.php');
            exit;

        } catch (PDOException $e) {
            $_SESSION['erro_cadastro'] = "Erro ao cadastrar: " . $e->getMessage();
            header('Location: cadastro.php');
            exit;
        }
    } else {
        // Se houver erros de validação
        $_SESSION['erro_cadastro'] = implode("<br>", $erros);
        header('Location: cadastro.php');
        exit;
    }
} else {
    header('Location: cadastro.php');
    exit;
}
    