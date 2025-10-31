<?php
session_start();
require_once 'conexao.php';

// Verifica login
if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// ID da dieta via GET
$id_dieta = $_GET['id'] ?? null;
$usuario_id = $_SESSION['usuario']['id'];

if (!$id_dieta) {
    header('Location: dieta.php');
    exit;
}

// Busca dieta do usuário
try {
    $stmt = $pdo->prepare("
        SELECT iddieta, nome_dieta, kcal_total, agua_ml, cafe_manha, lanche_manha, almoco, lanche_tarde, janta, ceia, data_criacao
        FROM dietas
        WHERE iddieta = ? AND usuario_id = ?
    ");
    $stmt->execute([$id_dieta, $usuario_id]);
    $dieta = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$dieta) {
        header('Location: dieta.php');
        exit;
    }
} catch (PDOException $e) {
    die("Erro ao buscar dieta: " . $e->getMessage());
}

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ver Dieta - <?= htmlspecialchars($dieta['nome_dieta']); ?></title>
<link rel="icon" type="image/png" href="image/logo-logfit.png">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">

<!-- Header -->
<header class="bg-gray-900 py-2 px-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
        <img src="image/logo-logfit.png" alt="logo" class="h-20 max-w-xs object-contain" />
        <div class="flex items-center gap-3">
            <a href="config.php"
               class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition">
               Configurações
            </a>
            <a href="logout.php"
               class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition">
               Sair
            </a>
        </div>
    </div>
</header>

<main class="flex-1 p-6">

    <!-- Botão Voltar no canto -->
    <div class="mb-4">
        <a href="dieta.php" 
           class ="flex items-center gap-2 px-4 py-2 text-gray-800 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <!-- Container principal -->
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">

        <!-- Título -->
        <div class="text-center mb-4">
            <h1 class="text-3xl font-bold mb-1"><?= htmlspecialchars($dieta['nome_dieta']); ?></h1>
            <p class="text-gray-500 text-sm">Criada em: <?= date('d/m/Y', strtotime($dieta['data_criacao'])); ?></p>
        </div>

        <!-- Resumo diário -->
        <div class="flex justify-between text-gray-800 font-medium py-2">
            <div>Calorias: <span class="font-bold"><?= $dieta['kcal_total']; ?> kcal</span></div>
            <div>Água: <span class="font-bold"><?= $dieta['agua_ml']; ?> ml</span></div>
        </div>

        <hr class="my-4">

        <!-- Refeições -->
        <h2 class="text-xl font-semibold mb-3 text-center">Refeições do Dia</h2>

        <div class="space-y-4">
            <?php 
            $refeicoes = [
                "Café da Manhã" => $dieta['cafe_manha'],
                "Lanche da Manhã" => $dieta['lanche_manha'],
                "Almoço" => $dieta['almoco'],
                "Lanche da Tarde" => $dieta['lanche_tarde'],
                "Janta" => $dieta['janta'],
                "Ceia" => $dieta['ceia']
            ];

            foreach ($refeicoes as $titulo => $conteudo): ?>
                <div class="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <h3 class="font-semibold text-gray-700 mb-1"><?= $titulo ?></h3>
                    <p class="text-gray-700 whitespace-pre-line">
                        <?= nl2br(htmlspecialchars($conteudo)); ?>
                    </p>
                </div>
            <?php endforeach; ?>
        </div>

    </div>
</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?= date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>

</body>
</html>
