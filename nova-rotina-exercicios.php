<?php
session_start();
require 'conexao.php';

// Verifica se usuário está logado
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// Verifica se o treino foi iniciado
$novoTreino = $_SESSION['novo_treino'] ?? null;
if (!$novoTreino) {
    header('Location: nova-rotina.php');
    exit;
}

// Buscar lista de exercícios cadastrados
$exercicios = $pdo->query("SELECT * FROM exercicios ORDER BY nome")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Escolher Exercícios</title>
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

    <!-- Botão Voltar no canto máximo à esquerda -->
    <div class="w-full mb-6">
        <a href="nova-rotina.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <!-- Bloco central -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg text-center">
        <h2 class="text-2xl font-bold mb-6">
            Adicionar Exercícios à Rotina "<?= htmlspecialchars($novoTreino['nome']) ?>"
        </h2>

        <form action="processa-nova-rotina.php" method="POST" class="space-y-4 text-left">
            <!-- Guardar dados do treino temporário em hidden inputs -->
            <input type="hidden" name="nome" value="<?= htmlspecialchars($novoTreino['nome']) ?>">
            <input type="hidden" name="dias_semana" value="<?= htmlspecialchars($novoTreino['dias_semana']) ?>">
            <input type="hidden" name="duracao_semanas" value="<?= htmlspecialchars($novoTreino['duracao_semanas']) ?>">
            <input type="hidden" name="data_inicio" value="<?= htmlspecialchars($novoTreino['data_inicio']) ?>">

            <div class="max-h-[400px] overflow-y-auto space-y-2">
                <?php foreach ($exercicios as $ex): ?>
                <label class="flex justify-between items-center border p-2 rounded cursor-pointer hover:bg-gray-50">
                    <span><?= htmlspecialchars($ex['nome']) ?> (<?= htmlspecialchars($ex['grupo_muscular']) ?>)</span>
                    <input type="checkbox" name="exercicios[]" value="<?= $ex['idexercicio'] ?>">
                </label>
                <?php endforeach; ?>
            </div>

            <button type="submit" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Finalizar Treino
            </button>
        </form>
    </div>

</main>

</body>
</html>
