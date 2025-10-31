<?php
session_start();
require 'conexao.php';

// Verifica login
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// Verifica se há rotina temporária
$novaRotina = $_SESSION['nova_rotina'] ?? null;
if (!$novaRotina) {
    header('Location: nova-rotina.php');
    exit;
}

// Recebe treinos já adicionados temporariamente à rotina
$treinosRotina = $_SESSION['treinos_rotina'] ?? [];

// Buscar treinos temporários do usuário (ou do banco, se preferir)
$treinos = $_SESSION['treinos_temporarios'] ?? [];
$treinos = is_array($treinos) ? $treinos : []; // garante que seja array

// Processar seleção de treinos existentes na sessão
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['treinos'])) {
    foreach ($_POST['treinos'] as $idTreinoSelecionado) {
        // Evitar duplicatas
        $alreadyAdded = false;
        foreach ($treinosRotina as $t) {
            if ($t['id'] == $idTreinoSelecionado) {
                $alreadyAdded = true;
                break;
            }
        }

        if (!$alreadyAdded) {
            // Buscar treino selecionado da sessão de treinos temporários
            foreach ($treinos as $t) {
                if ($t['id'] == $idTreinoSelecionado) {
                    $treinosRotina[] = $t;
                    break;
                }
            }
        }
    }
    $_SESSION['treinos_rotina'] = $treinosRotina;
    header('Location: selecionar-treino.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Selecionar Treinos</title>
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

    <!-- Botões Voltar e Criar -->
    <div class="w-full mb-6 flex justify-between items-center">
        <a href="nova-rotina-treino.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>

        <a href="novo-treino.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition bg-gray-400 hover:bg-gray-500 text-white">
            Criar Novo Treino
        </a>
    </div>

    <!-- Card central de seleção de treinos -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg mb-6">
        <h2 class="text-2xl font-bold mb-4 text-center">Selecionar Treinos para a Rotina</h2>

        <?php if ($treinos): ?>
        <form method="POST">
            <div class="max-h-[400px] overflow-y-auto space-y-2 mb-4">
                <?php foreach ($treinos as $t): ?>
                    <label class="flex justify-between items-center border p-2 rounded cursor-pointer hover:bg-gray-50">
                        <span><?= htmlspecialchars($t['nome']) ?> (<?= htmlspecialchars($t['dias_semana']) ?> dias/semana)</span>
                        <input type="checkbox" name="treinos[]" value="<?= htmlspecialchars($t['id']) ?>">
                    </label>
                <?php endforeach; ?>
            </div>

            <button type="submit" 
                    class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Adicionar Selecionados
            </button>
        </form>
        <?php else: ?>
            <p class="text-gray-600 text-center mb-4">Você ainda não possui treinos criados.</p>
        <?php endif; ?>
    </div>

    <!-- Lista de treinos já adicionados à rotina -->
    <?php if ($treinosRotina): ?>
    <div class="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg">
        <h3 class="text-xl font-bold mb-4">Treinos adicionados à rotina:</h3>
        <ul class="list-disc list-inside space-y-2">
            <?php foreach ($treinosRotina as $t): ?>
            <li><?= htmlspecialchars($t['nome']) ?> (<?= htmlspecialchars($t['dias_semana']) ?> dias/semana)</li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php endif; ?>

</main>
</body>
</html>