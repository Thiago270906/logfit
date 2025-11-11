<?php
session_start();
require 'conexao.php';

// Segurança: usuário logado
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// ID do usuário
$usuarioId = $_SESSION['usuario']['id'] ?? $_SESSION['usuario_id'] ?? null;
if (!$usuarioId) {
    echo "<p style='color:red;'>Erro: usuário não identificado. Faça login novamente.</p>";
    exit;
}

// idTreino via GET
$idTreino = isset($_GET['idtreino']) ? (int) $_GET['idtreino'] : 0;
if ($idTreino <= 0) {
    header('Location: selecionar-treino.php');
    exit;
}

// Verifica se o treino pertence ao usuário e obtem descanso_padrao_seg
$stmt = $pdo->prepare("SELECT idtreino, usuario_id, nome, descanso_padrao_seg FROM treinos WHERE idtreino = ? AND usuario_id = ?");
$stmt->execute([$idTreino, $usuarioId]);
$treino = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$treino) {
    $_SESSION['msg_erro'] = "Treino não encontrado ou sem permissão.";
    header('Location: editar-rotina.php');
    exit;
}

// Processa POST: adicionar exercícios selecionados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selecionados = $_POST['exercicios'] ?? [];
    if (empty($selecionados) || !is_array($selecionados)) {
        $_SESSION['msg_erro'] = "Selecione ao menos um exercício para adicionar.";
        header("Location: editar-selecionar-exercicio.php?idtreino={$idTreino}");
        exit;
    }

    // filtra inteiros e remove duplicatas
    $selecionados = array_values(array_unique(array_map('intval', $selecionados)));

    try {
        $pdo->beginTransaction();

        // prepara consulta para obter dados dos exercicios selecionados
        $placeholders = implode(',', array_fill(0, count($selecionados), '?'));
        $stmtEx = $pdo->prepare("SELECT idexercicio AS id, nome FROM exercicios WHERE idexercicio IN ($placeholders)");
        $stmtEx->execute($selecionados);
        $exerciciosDados = $stmtEx->fetchAll(PDO::FETCH_ASSOC);

        // prepara insert
        $stmtIns = $pdo->prepare("
            INSERT INTO treino_exercicios (treino_id, exercicio_id, nome_exercicio, series, repeticoes, carga_kg, descanso_seg)
            VALUES (?, ?, ?, NULL, NULL, NULL, ?)
        ");

        $descansoPadrao = intval($treino['descanso_padrao_seg'] ?? 60);

        foreach ($exerciciosDados as $ex) {
            // Evitar inserir exercício duplicado (caso sincronização/concorrência)
            $stmtChk = $pdo->prepare("SELECT 1 FROM treino_exercicios WHERE treino_id = ? AND exercicio_id = ? LIMIT 1");
            $stmtChk->execute([$idTreino, $ex['id']]);
            if ($stmtChk->fetchColumn()) {
                continue; // já existe, pula
            }

            $stmtIns->execute([$idTreino, $ex['id'], $ex['nome'], $descansoPadrao]);
        }

        $pdo->commit();

        $_SESSION['msg_sucesso'] = "Exercícios adicionados ao treino com sucesso.";
        header("Location: editar-exercicios.php?idtreino={$idTreino}");
        exit;

    } catch (Exception $e) {
        $pdo->rollBack();
        $_SESSION['msg_erro'] = "Erro ao adicionar exercícios: " . $e->getMessage();
        header("Location: editar-selecionar-exercicio.php?idtreino={$idTreino}");
        exit;
    }
}

// Buscar exercícios do catálogo que ainda não estejam vinculados ao treino
try {
    $stmt = $pdo->prepare("
        SELECT e.idexercicio AS id, e.nome, e.grupo_muscular
        FROM exercicios e
        WHERE e.idexercicio NOT IN (
            SELECT exercicio_id FROM treino_exercicios WHERE treino_id = ?
        )
        ORDER BY e.grupo_muscular, e.nome
    ");
    $stmt->execute([$idTreino]);
    $exercicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    echo "<pre style='color:red;'>Erro ao buscar exercícios: " . htmlspecialchars($e->getMessage()) . "</pre>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Adicionar Exercícios ao Treino - LogFit</title>
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
        <h1 class="text-2xl font-bold text-center mb-4">Adicionar Exercícios ao Treino</h1>

        <p class="text-gray-700 mb-4 text-center">
            Treino: <strong><?= htmlspecialchars($treino['nome']) ?></strong>
        </p>

        <?php if (!empty($_SESSION['msg_erro'])): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                <?= htmlspecialchars($_SESSION['msg_erro']); unset($_SESSION['msg_erro']); ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($_SESSION['msg_sucesso'])): ?>
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                <?= htmlspecialchars($_SESSION['msg_sucesso']); unset($_SESSION['msg_sucesso']); ?>
            </div>
        <?php endif; ?>

        <?php if ($exercicios): ?>
            <form method="POST" class="space-y-4">
                <div class="max-h-[420px] overflow-y-auto border rounded-lg p-3 space-y-2">
                    <?php foreach ($exercicios as $ex): ?>
                        <label class="flex justify-between items-center border-b py-2 px-2 cursor-pointer hover:bg-gray-50">
                            <div>
                                <p class="font-semibold text-gray-800"><?= htmlspecialchars($ex['nome']) ?></p>
                                <p class="text-sm text-gray-500"><?= htmlspecialchars($ex['grupo_muscular']) ?></p>
                            </div>
                            <input type="checkbox" name="exercicios[]" value="<?= (int)$ex['id'] ?>" class="w-5 h-5 accent-green-600">
                        </label>
                    <?php endforeach; ?>
                </div>

                <div class="flex justify-between mt-6">
                    <a href="editar-exercicios.php?idtreino=<?= $idTreino ?>" class="flex items-center gap-2 px-4 py-2 rounded-md">
                        <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
                        Voltar
                    </a>

                    <button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                        Adicionar Selecionados
                    </button>
                </div>
            </form>
        <?php else: ?>
            <p class="text-gray-600">Não há exercícios disponíveis para adicionar (todos já vinculados a este treino).</p>
            <div class="mt-4 flex justify-end">
                <a href="adicionar-exercicio.php" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Cadastrar novo exercício</a>
            </div>
        <?php endif; ?>
    </div>
</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?= date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>
</body>
</html>