<?php
session_start(); // Inicia a sessão para armazenar mensagens e dados temporários
require_once 'conexao.php'; // Inclui o arquivo que estabelece a conexão com o banco de dados

// Função responsável por validar os dados do formulário de cadastro
function validarDados($dados) {
    $erros = []; // Array para armazenar mensagens de erro
    
    // Verifica se o nome tem pelo menos 3 caracteres
    if (strlen($dados['nome']) < 3) {
        $erros[] = "Nome deve ter no mínimo 3 caracteres";
    }
    
    // Valida se o email está em formato válido
    if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        $erros[] = "E-mail inválido";
    }
    
    // Verifica se a senha tem pelo menos 8 caracteres
    if (strlen($dados['senha']) < 8) {
        $erros[] = "Senha deve ter no mínimo 8 caracteres";
    }
    
    // Confirma se a senha e sua confirmação são iguais
    if ($dados['senha'] !== $dados['confirma_senha']) {
        $erros[] = "As senhas não conferem";
    }
    
    // Retorna o array de erros (vazio se não houverem)
    return $erros;
}

// Verifica se o formulário foi submetido via método POST (envio de dados)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Verifica se o token CSRF enviado no formulário corresponde ao da sessão para evitar ataques CSRF
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        die("Erro de validação do formulário"); // Interrompe a execução caso o token seja inválido
    }
    
    // Chama a função de validação dos dados recebidos
    $erros = validarDados($_POST);
    
    // Se não houver erros na validação dos dados
    if (empty($erros)) {
        try {
            // Prepara uma consulta para verificar se o email já está cadastrado no banco
            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
            $stmt->execute([$_POST['email']]);
            
            // Se já existir algum registro com o email informado
            if ($stmt->rowCount() > 0) {
                $_SESSION['erro_cadastro'] = "Este e-mail já está cadastrado"; // Mensagem de erro na sessão
                header('Location: cadastro.php'); // Redireciona de volta para o formulário de cadastro
                exit;
            }
            
            // Prepara os dados para inserção, removendo espaços extras
            $nome = trim($_POST['nome']);
            $email = trim($_POST['email']);
            // Criptografa a senha para armazenamento seguro no banco de dados
            $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);
            
            // Insere o novo usuário na base de dados
            $sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nome, $email, $senha]);
            
            // Caso o cadastro tenha sido bem-sucedido, seta mensagem de sucesso na sessão
            $_SESSION['sucesso_cadastro'] = "Cadastro realizado com sucesso!";
            header('Location: login.php'); // Redireciona para a página de login
            exit;
            
        } catch (PDOException $e) {
            // Em caso de erro na comunicação com o banco ou na inserção
            $_SESSION['erro_cadastro'] = "Erro ao realizar cadastro";
            header('Location: cadastro.php'); // Volta para o formulário de cadastro com erro
            exit;
        }
    } else {
        // Se houver erros de validação, os junta em uma string e coloca na sessão para exibir ao usuário
        $_SESSION['erro_cadastro'] = implode("
", $erros);
        header('Location: cadastro.php'); // Redireciona para o formulário de cadastro
        exit;
    }
}
