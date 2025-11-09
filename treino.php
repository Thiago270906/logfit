<?php
session_start();
require_once 'conexao.php';

if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];
$nomeUsuario = $_SESSION['usuario']['nome'] ?? 'Usuário';

// Buscar Rotina Ativa
$stmt = $pdo->prepare("
    SELECT idrotina, nome, dias_semana, data_inicio, data_fim 
    FROM rotinas_treino 
    WHERE usuario_id = ? AND ativa = 1 
    LIMIT 1
");
$stmt->execute([$usuario_id]);
$rotina = $stmt->fetch(PDO::FETCH_ASSOC);

$treinos = [];
if ($rotina) {
    // Buscar todos os treinos dessa rotina
    $stmtTreinos = $pdo->prepare("
        SELECT DISTINCT t.idtreino, t.nome, t.dia_semana
        FROM rotina_treinos rt
        JOIN treinos t ON t.idtreino = rt.treino_id
        WHERE rt.rotina_id = ?
        ORDER BY rt.ordem_dia
    "); 
    $stmtTreinos->execute([$rotina['idrotina']]);
    $treinos = $stmtTreinos->fetchAll(PDO::FETCH_ASSOC);

    // Buscar exercícios de cada treino
    foreach ($treinos as $i => $t) {
        $stmtEx = $pdo->prepare("
            SELECT nome_exercicio, series, repeticoes, carga_kg, descanso_seg
            FROM treino_exercicios
            WHERE treino_id = ?
        ");
        $stmtEx->execute([$t['idtreino']]);
        $treinos[$i]['exercicios'] = $stmtEx->fetchAll(PDO::FETCH_ASSOC);
    }
}
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

    <div class="max-w-3xl mx-auto">

        <h2 class="text-2xl font-semibold text-center mb-6">Treino Atual</h2>

        <?php if ($rotina): ?>
            <div class="bg-white shadow-lg p-6 rounded-lg mb-6">

                <h3 class="text-2xl font-bold mb-2 text-center text-gray-800"><?= htmlspecialchars($rotina['nome']) ?></h3>

                <div class="text-center text-gray-600 mb-4">
                    <p><strong>Dias/semana:</strong> <?= $rotina['dias_semana'] ?></p>
                    <p><strong>Início:</strong> <?= date('d/m/Y', strtotime($rotina['data_inicio'])) ?></p>
                    <?php if ($rotina['data_fim']): ?>
                        <p><strong>Término previsto:</strong> <?= date('d/m/Y', strtotime($rotina['data_fim'])) ?></p>
                    <?php endif; ?>
                </div>

                <!-- Listagem de Treinos -->
                <?php if (!empty($treinos)): ?>
                    <div class="space-y-6">
                        <?php foreach ($treinos as $t): ?>
                            <div class="border rounded-lg p-4 bg-gray-50">
                                <div class="flex justify-between mb-3">
                                    <h4 class="text-lg font-semibold text-gray-800"><?= htmlspecialchars($t['nome']) ?></h4>
                                    <span class="text-sm text-gray-500"><?= htmlspecialchars($t['dia_semana']) ?></span>
                                </div>

                                <?php if (!empty($t['exercicios'])): ?>
                                    <ul class="divide-y divide-gray-200">
                                        <?php foreach ($t['exercicios'] as $ex): ?>
                                            <li class="py-2">
                                                <div class="flex justify-between">
                                                    <span class="font-medium text-gray-700"><?= htmlspecialchars($ex['nome_exercicio']) ?></span>
                                                    <span class="text-gray-500 text-sm"><?= $ex['series'] ?>x<?= htmlspecialchars($ex['repeticoes']) ?></span>
                                                </div>
                                                <div class="text-sm text-gray-500">
                                                    Carga: <?= $ex['carga_kg'] ?: '-' ?> kg • Descanso: <?= $ex['descanso_seg'] ?: '-' ?> seg
                                                </div>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                <?php else: ?>
                                    <p class="text-gray-500 text-sm italic">Nenhum exercício cadastrado.</p>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <p class="text-gray-600 text-center mt-4">Nenhum treino vinculado a esta rotina.</p>
                <?php endif; ?>

                <div class="mt-6 flex justify-center">
                    <a href="alterar-rotina.php" class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md">
                        Alterar Treino
                    </a>
                </div>
            </div>

        <?php else: ?>
            <div class="bg-white shadow-lg p-6 text-center rounded-lg">
                <p class="text-gray-600 mb-4">Você ainda não possui um treino ativo.</p>
                <a href="alterar-rotina.php" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    Selecionar Treino
                </a>
            </div>
        <?php endif; ?>

    </div>
</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?php echo date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>

</body>
</html>