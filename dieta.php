<?php
session_start();
require_once 'conexao.php'; // sua conexão PDO

if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];
$nomeUsuario = $_SESSION['usuario']['nome'] ?? 'Usuário';

// Busca dietas do usuário
try {
    $stmt = $pdo->prepare("
    SELECT iddieta, nome_dieta, kcal_total, agua_ml, cafe_manha, lanche_manha, almoco, lanche_tarde, janta, ceia, data_criacao
    FROM dietas
    WHERE usuario_id = ?
    ORDER BY data_criacao DESC
");
$stmt->execute([$usuario_id]);
$dietas = $stmt->fetchAll(PDO::FETCH_ASSOC);
;
} catch (PDOException $e) {
    $dietas = [];
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dieta - LogFit</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">

<!-- Header -->
<header class="bg-gray-900 py-2 px-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
        <img src="image/logo-logfit.png" alt="logo" class="h-20 max-w-xs object-contain" />
        <div class="flex items-center gap-3">
            <a href="config.php"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
                Configurações
            </a>
            <a href="logout.php"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors">
                Sair
            </a>
        </div>
    </div>
</header>

<!-- Conteúdo -->
<main class="flex-1 p-6">

    <!-- Barra superior com botões afastados -->
    <div class="w-full px-6">
    <div class="flex justify-between mb-6">
        <a href="index.php" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition">
            ◀ Voltar
        </a>

        <a href="nova-dieta.php" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition">
            Criar Dieta
        </a>
    </div>
</div>


    <!-- Linha divisória -->
    <hr class="mb-6 border-gray-400">

    <!-- Título -->
    <h2 class="text-2xl font-semibold mb-6">Minhas Dietas</h2>

    <?php if (!empty($dietas)): ?>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <?php foreach ($dietas as $dieta): ?>
                <div class="bg-white shadow p-4 rounded-lg flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-bold mb-2"><?= htmlspecialchars($dieta['nome_dieta']); ?></h3>
                        <p class="text-gray-600">Calorias: <span class="font-semibold"><?= $dieta['kcal_total']; ?> kcal</span></p>
                        <p class="text-gray-600">Água: <span class="font-semibold"><?= $dieta['agua_ml']; ?> ml</span></p>

                        <p class="text-gray-500 text-sm mt-1">Criada em: <?= date('d/m/Y', strtotime($dieta['data_criacao'])); ?></p>
                    </div>

                    <a href="ver-dieta.php?id=<?= $dieta['iddieta']; ?>"
                       class="mt-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm text-center">
                        Ver Dieta
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <div class="text-center text-gray-500 italic py-8">
            Nenhuma dieta criada ainda. Clique em <span class="font-semibold">"Criar Nova Dieta"</span> para começar.
        </div>
    <?php endif; ?>

</main>

<!-- Rodapé -->
<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?= date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>

</body>
</html>
