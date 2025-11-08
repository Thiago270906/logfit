<?php
session_start();
require 'conexao.php';

// segurança
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// busca exercícios no banco
$sql = $pdo->query("SELECT idexercicio AS id, nome, grupo_muscular FROM exercicios ORDER BY grupo_muscular, nome");
$exercicios = $sql->fetchAll(PDO::FETCH_ASSOC);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selecionados = $_POST['exercicios'] ?? [];

    if (empty($selecionados)) {
        $_SESSION['msg_erro'] = "Selecione pelo menos um exercício.";
        header('Location: selecionar-exercicios.php');
        exit;
    }

    // busca os detalhes dos selecionados
    $placeholders = implode(',', array_fill(0, count($selecionados), '?'));
    $stmt = $pdo->prepare("SELECT idexercicio AS id, nome, grupo_muscular FROM exercicios WHERE idexercicio IN ($placeholders)");
    $stmt->execute($selecionados);
    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // salva em sessão para a próxima etapa
    $_SESSION['exercicios_treino'] = $dados;

    // vai para confirmar
    header('Location: confirmar-exercicios.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Selecionar Exercícios</title>
<link rel="icon" type="image/png" href="image/logo-logfit.png">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">

<header class="bg-gray-900 py-2 px-4">
    <div class="max-w-7xl mx-auto flex justify-center">
        <img src="image/logo-logfit.png" alt="logo" class="h-20 object-contain" />
    </div>
</header>

<main class="flex-1 p-6 flex flex-col items-center">
    <div class="w-full max-w-3xl bg-white shadow-lg p-8 rounded-lg">
        <h1 class="text-2xl font-bold text-center mb-6">Selecionar Exercícios</h1>

        <?php if ($exercicios): ?>
        <form method="POST" class="space-y-4">
            <div class="max-h-[450px] overflow-y-auto border rounded-lg p-4 space-y-2">
                <?php foreach ($exercicios as $ex): ?>
                    <label class="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-50 px-2">
                        <div>
                            <p class="font-semibold text-gray-800"><?= htmlspecialchars($ex['nome']) ?></p>
                            <p class="text-sm text-gray-500"><?= htmlspecialchars($ex['grupo_muscular']) ?></p>
                        </div>
                        <input type="checkbox" name="exercicios[]" value="<?= htmlspecialchars($ex['id']) ?>" class="w-5 h-5">
                    </label>
                <?php endforeach; ?>
            </div>

            <div class="flex justify-between mt-6">
                <a href="nova-rotina-treino.php"
                   class="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition">
                    Voltar
                </a>

                <button type="submit"
                        class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                    Confirmar Seleção
                </button>
            </div>
        </form>
        <?php else: ?>
            <p class="text-gray-600 text-center mb-4">Nenhum exercício encontrado no banco de dados.</p>
        <?php endif; ?>
    </div>
</main>
</body>
</html>
