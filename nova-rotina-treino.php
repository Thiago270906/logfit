<?php
session_start();
require 'conexao.php';

// Verifica login
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// Verifica se rotina foi definida
$novaRotina = $_SESSION['nova_rotina'] ?? null;
if (!$novaRotina) {
    header('Location: nova-rotina.php');
    exit;
}

// Lista temporária de treinos adicionados à rotina (na sessão)
$treinos = $_SESSION['treinos_rotina'] ?? [];
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nova Rotina - Criar Treinos</title>
<link rel="icon" type="image/png" href="image/logo-logfit.png">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">

<!-- Header -->
<header class="bg-gray-900 py-2 px-4">
    <div class="max-w-7xl mx-auto flex justify-center">
        <img src="image/logo-logfit.png" alt="logo" class="h-20 object-contain" />
    </div>
</header>

<main class="flex-1 p-6 flex flex-col items-center">

    <!-- Botão Voltar -->
    <div class="w-full mb-6">
        <a href="nova-rotina.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <!-- Card da rotina -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg text-center mb-6">
        <h2 class="text-2xl font-bold mb-4">Rotina Criada Temporariamente</h2>

        <p class="text-gray-700 mb-6">
            Agora selecione os treinos que compõem essa rotina.
        </p>

        <div class="text-left bg-gray-50 border rounded-lg p-4 mb-6">
            <p><strong>Nome:</strong> <?= htmlspecialchars($novaRotina['nome']) ?></p>
            <p><strong>Dias/semana:</strong> <?= htmlspecialchars($novaRotina['dias_semana']) ?></p>
            <p><strong>Duração:</strong> <?= htmlspecialchars($novaRotina['duracao_semanas']) ?> semanas</p>
            <p><strong>Início:</strong> <?= htmlspecialchars($novaRotina['data_inicio']) ?></p>
        </div>

        <!-- Botão para selecionar treinos existentes -->
        <a href="selecionar-treino.php"
           class="block w-full py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition mb-4">
            Selecionar Treino
        </a>

        <!-- Botão finalizar rotina -->
        <form action="processa-nova-rotina.php" method="POST">
            <button type="submit"
                    class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Finalizar Rotina
            </button>
        </form>
    </div>

    <!-- Lista de treinos adicionados -->
    <?php if ($treinos): ?>
    <div class="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg">
        <h3 class="text-xl font-bold mb-4">Treinos adicionados:</h3>
        <ul class="list-disc list-inside space-y-2">
            <?php foreach ($treinos as $t): ?>
            <li><?= htmlspecialchars($t['nome']) ?> (<?= htmlspecialchars($t['dias_semana']) ?> dias/semana)</li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php endif; ?>

</main>
</body>
</html>
