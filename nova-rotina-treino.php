<?php
session_start();
require 'conexao.php';

// Segurança: usuário logado
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$idUsuario = $_SESSION['usuario']['id'] ?? $_SESSION['usuario_id'] ?? $_SESSION['idusuario'] ?? null;
if (!$idUsuario) {
    echo "<p style='color:red;'>Erro: usuário não identificado na sessão. Faça login novamente.</p>";
    exit;
}

// --- Remover treino individual ---
if (isset($_GET['excluir_treino'])) {
    $idExcluir = intval($_GET['excluir_treino']);

    if (!empty($_SESSION['treinos_rotina'])) {
        $_SESSION['treinos_rotina'] = array_filter($_SESSION['treinos_rotina'], function ($t) use ($idExcluir) {
            $idTreino = is_array($t) ? ($t['idtreino'] ?? null) : $t;
            return $idTreino != $idExcluir;
        });
    }

    header("Location: nova-rotina-treino.php");
    exit;
}

// Verifica se há rotina temporária
$novaRotina = $_SESSION['nova_rotina'] ?? null;
if (!$novaRotina) {
    header('Location: nova-rotina.php');
    exit;
}

// Verifica se há treinos já selecionados (vindos da página anterior)
$treinosSelecionados = $_SESSION['treinos_rotina'] ?? [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo->beginTransaction();

        // Criar rotina
        $duracaoSemanas = intval($novaRotina['duracao_semanas']);
        $stmt = $pdo->prepare("
            INSERT INTO rotinas_treino (
                usuario_id, nome, dias_semana, duracao_semanas, 
                data_inicio, data_fim, data_ativacao, ativa
            ) VALUES (
                ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL $duracaoSemanas WEEK), NOW(), 1
            )
        ");
        $stmt->execute([
            $idUsuario,
            $novaRotina['nome'],
            $novaRotina['dias_semana'],
            $duracaoSemanas
        ]);
        $idRotina = $pdo->lastInsertId();

        // Vincular os treinos selecionados
        $stmtTreino = $pdo->prepare("
            INSERT INTO rotina_treinos (rotina_id, treino_id, ordem_dia)
            VALUES (?, ?, ?)
        ");

        $ordem = 1;
        foreach ($treinosSelecionados as $t) {
            $idTreino = is_array($t) ? $t['idtreino'] : $t;
            $stmtTreino->execute([$idRotina, $idTreino, $ordem++]);
        }

        $pdo->commit();

        unset($_SESSION['nova_rotina'], $_SESSION['treinos_rotina']);

        $_SESSION['msg_sucesso'] = "✅ Rotina '{$novaRotina['nome']}' criada com sucesso!";
        header('Location: treino.php');
        exit;

    } catch (Exception $e) {
        $pdo->rollBack();
        echo "<pre style='color:red;'>Erro ao salvar rotina: " . htmlspecialchars($e->getMessage()) . "</pre>";
        exit;
    }
}

// Buscar detalhes dos treinos selecionados (sessão)
$treinos = [];

if (!empty($_SESSION['treinos_rotina'])) {
    $treinos = $_SESSION['treinos_rotina'];
} elseif (!empty($_POST['treinos'])) {
    $treinosSelecionados = array_map('intval', $_POST['treinos']);
    if (!empty($treinosSelecionados)) {
        $in = str_repeat('?,', count($treinosSelecionados) - 1) . '?';
        $stmt = $pdo->prepare("SELECT idtreino, nome, dia_semana FROM treinos WHERE idtreino IN ($in)");
        $stmt->execute($treinosSelecionados);
        $treinos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nova Rotina - Confirmar Treinos</title>
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

    <!-- Card principal -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg text-center mb-6">
        <h2 class="text-2xl font-bold mb-4">Treinos Selecionados</h2>

        <p class="text-gray-700 mb-6">
            Veja abaixo os treinos que farão parte de <strong><?= htmlspecialchars($novaRotina['nome']) ?></strong>.
        </p>

        <div class="text-left bg-gray-50 border rounded-lg p-4 mb-6">
            <p><strong>Dias/semana:</strong> <?= htmlspecialchars($novaRotina['dias_semana']) ?></p>
            <p><strong>Duração:</strong> <?= htmlspecialchars($novaRotina['duracao_semanas']) ?> semanas</p>
            <p><strong>Início:</strong> <?= htmlspecialchars($novaRotina['data_inicio']) ?></p>
        </div>

        <?php if (!empty($treinos)): ?>
            <div class="flex flex-col gap-3 text-left">
                <?php foreach ($treinos as $t): ?>
                    <div class="flex justify-between items-center border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div class="flex flex-col text-center w-full">
                            <span class="text-lg font-semibold text-gray-800"><?= htmlspecialchars($t['nome']) ?></span>
                            <span class="text-sm text-gray-500"><?= htmlspecialchars($t['dia_semana']) ?></span>
                        </div>
                        <a href="?excluir_treino=<?= $t['idtreino'] ?>" 
                           class="ml-4 p-2 bg-gray-50 rounded-lg transition"
                           title="Remover treino">
                            <img src="image/lixeira.png" alt="Excluir" class="w-5 h-5">
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="mt-6 flex flex-col gap-3">
                <a href="selecionar-treino.php" 
                   class="block w-full py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition">
                    Selecionar Mais Treinos
                </a>

                <form method="POST">
                    <button type="submit" 
                            class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                        Confirmar Rotina
                    </button>
                </form>
            </div>
        <?php else: ?>
            <p class="text-gray-600 mb-4">Nenhum treino selecionado até o momento.</p>
            <a href="selecionar-treino.php" 
               class="block w-full py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition">
               Selecionar Treinos
            </a>
        <?php endif; ?>
    </div>

</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?= date('Y') ?> LogFit. Todos os direitos reservados.
</footer>
</body>
</html>