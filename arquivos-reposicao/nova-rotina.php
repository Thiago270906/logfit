<?php
session_start();
require 'conexao.php';

$idusuario = $_SESSION['usuario']['id'] ?? null;
if (!$idusuario) {
    header('Location: login.php');
    exit;
}

// Quando enviar o formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Salva dados da rotina temporariamente na sessão
    $_SESSION['nova_rotina'] = [
        'nome' => trim($_POST['nome']),
        'dias_semana' => $_POST['dias_semana'],
        'duracao_semanas' => $_POST['duracao_semanas'],
        'data_inicio' => $_POST['data_inicio']
    ];

    // Redireciona para a página de criar treinos
    header('Location: nova-rotina-treino.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Criar Rotina</title>
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

<!-- Conteúdo -->
<main class="flex-1 p-6 flex flex-col items-center">

    <!-- Botão voltar -->
    <div class="w-full mb-6">
        <a href="index.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <!-- Card Central -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-6 text-center">Criar Nova Rotina</h2>

        <form action="" method="POST" class="space-y-5">

            <div>
                <label class="block font-semibold mb-1">Nome da Rotina</label>
                <input type="text" name="nome" placeholder="Ex: Hipertrofia / Cutting / Full Body"
                       class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>

            <div>
                <label class="block font-semibold mb-1">Dias por Semana</label>
                <input type="number" name="dias_semana" min="1" max="7"
                       class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>

            <div>
                <label class="block font-semibold mb-1">Duração (semanas)</label>
                <input type="number" name="duracao_semanas" min="1" max="52"
                       class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>

            <div>
                <label class="block font-semibold mb-1">Data de Início</label>
                <input type="date" name="data_inicio"
                       class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>

            <button type="submit"
                    class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Próximo Passo: Criar Treinos
            </button>
        </form>
    </div>
</main>
</body>
</html>
