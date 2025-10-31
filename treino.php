<?php
session_start();
require_once 'conexao.php';

if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];
$nomeUsuario = $_SESSION['usuario']['nome'] ?? 'Usuário';

// Buscar Treino Ativo
$stmt = $pdo->prepare("
    SELECT idrotina, nome, dias_semana, data_inicio, data_fim 
    FROM rotinas_treino 
    WHERE usuario_id = ? AND ativa = 1 
    LIMIT 1
");
$stmt->execute([$usuario_id]);
$treino = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Treino Atual - LogFit</title>
<link rel="icon" type="image/png" href="image/logo-logfit.png">
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 min-h-screen flex flex-col">

<header class="bg-gray-900 py-2 px-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
        <img src="image/logo-logfit.png" class="h-20" />
        <div class="flex gap-3">
            <a href="config.php" class="px-4 py-2 bg-blue-600 text-white rounded-md">Configurações</a>
            <a href="logout.php" class="px-4 py-2 bg-red-600 text-white rounded-md">Sair</a>
        </div>
    </div>
</header>

<main class="flex-1 p-6">

    <!-- Voltar -->
    <a href="index.php" class="flex items-center gap-2 px-4 py-2 font-medium mb-4">
        <img src="image/seta-esquerda.png" class="w-5 h-5">
        Voltar
    </a>

    <!-- Container central -->
    <div class="max-w-xl mx-auto text-center">

        <h2 class="text-2xl font-semibold mb-6">Treino Atual</h2>

        <?php if ($treino): ?>
            <div class="bg-white shadow-lg p-6 rounded-lg">

                <h3 class="text-xl font-bold mb-2"><?= htmlspecialchars($treino['nome']) ?></h3>

                <p class="text-gray-600 mb-1">
                    Dias por Semana: <span class="font-semibold"><?= $treino['dias_semana'] ?></span>
                </p>

                <p class="text-gray-600 mb-1">
                    Início:
                    <span class="font-semibold"><?= date('d/m/Y', strtotime($treino['data_inicio'])) ?></span>
                </p>

                <?php if ($treino['data_fim']): ?>
                <p class="text-gray-600 mb-1">
                    Final previsto:
                    <span class="font-semibold"><?= date('d/m/Y', strtotime($treino['data_fim'])) ?></span>
                </p>
                <?php endif; ?>

                <div class="mt-6 flex gap-3">
                    <a href="ver-treino.php?id=<?= $treino['idrotina'] ?>" class="flex-1 py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                        Ver Detalhes do Treino
                    </a>

                    <a href="alterar-treino.php" class="flex-1 py-2 text-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-md">
                        Alterar Treino
                    </a>
                </div>
            </div>

        <?php else: ?>

            <div class="bg-white shadow-lg p-6 text-center rounded-lg">
                <p class="text-gray-600 mb-4">Você ainda não possui um treino ativo.</p>
                <a href="novo-treino.php" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    Criar Novo Treino
                </a>
            </div>

        <?php endif; ?>

    </div> <!-- encerra centralização -->

</main>

<footer class="bg-gray-900 text-white text-center py-3">
    © <?= date('Y') ?> LogFit
</footer>

</body>
</html>