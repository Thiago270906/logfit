<?php
session_start();
require 'conexao.php';

// --- Verificação de login ---
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// --- Identifica o usuário logado ---
$idUsuario = $_SESSION['usuario']['id'] ?? $_SESSION['usuario_id'] ?? $_SESSION['idusuario'] ?? null;
if (!$idUsuario) {
    echo "<p style='color:red;'>Erro: usuário não identificado. Faça login novamente.</p>";
    exit;
}

// --- Pega o ID da rotina (via GET) ---
$idRotina = $_GET['idrotina'] ?? $_GET['id'] ?? null;
if (!$idRotina) {
    header('Location: alterar-rotina.php');
    exit;
}
$idRotina = (int)$idRotina;

// --- Busca a rotina ---
$stmt = $pdo->prepare("SELECT * FROM rotinas WHERE idrotina = ? AND usuario_id = ?");
$stmt->execute([$idRotina, $idUsuario]);
$rotina = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$rotina) {
    $_SESSION['msg_erro'] = "Rotina não encontrada ou sem permissão.";
    header('Location: alterar-rotina.php');
    exit;
}

// --- Busca os treinos vinculados ---
$stmtTreinos = $pdo->prepare("
    SELECT t.idtreino, t.nome, t.dia_semana
    FROM rotina_treinos rt
    JOIN treinos t ON t.idtreino = rt.treino_id
    WHERE rt.rotina_id = ?
    ORDER BY rt.ordem_dia
");
$stmtTreinos->execute([$idRotina]);
$treinos = $stmtTreinos->fetchAll(PDO::FETCH_ASSOC);

// --- Se o usuário escolheu um treino ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['treino_id'])) {
    $idTreino = (int)$_POST['treino_id'];
    header("Location: editar-exercicios.php?idtreino=$idTreino&idrotina=$idRotina");
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Editar Treinos da Rotina - LogFit</title>
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

    <!-- Voltar -->
    <div class="w-full mb-6">
        <a href="editar-rotina.php?id=<?= htmlspecialchars($idRotina) ?>" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <!-- Card principal -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg text-center mb-6">
        <h2 class="text-2xl font-bold mb-4">Editar Treinos da Rotina</h2>

        <p class="text-gray-700 mb-6">
            Você está editando a rotina <strong><?= htmlspecialchars($rotina['nome']) ?></strong>.
        </p>

        <div class="text-left bg-gray-50 border rounded-lg p-4 mb-6">
            <p><strong>Dias/semana:</strong> <?= htmlspecialchars($rotina['dias_semana']) ?></p>
            <p><strong>Data de Início:</strong> <?= date('d/m/Y', strtotime($rotina['data_inicio'])) ?></p>
            <?php if (!empty($rotina['data_fim'])): ?>
                <p><strong>Data de Fim:</strong> <?= date('d/m/Y', strtotime($rotina['data_fim'])) ?></p>
            <?php endif; ?>
        </div>

        <?php if (!empty($treinos)): ?>
            <form method="POST" class="flex flex-col gap-3 text-left">
                <?php foreach ($treinos as $t): ?>
                    <div class="flex justify-between items-center border border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                        <div class="flex items-center gap-3">
                            <input type="radio" name="treino_id" value="<?= $t['idtreino'] ?>" class="w-5 h-5 accent-green-600 cursor-pointer">
                            <div class="flex flex-col">
                                <span class="text-lg font-semibold text-gray-800"><?= htmlspecialchars($t['nome']) ?></span>
                                <span class="text-sm text-gray-500"><?= htmlspecialchars($t['dia_semana']) ?></span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>

                <button type="submit" 
                        class="w-full py-2 mt-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition">
                    Editar Exercícios
                </button>
            </form>

        <?php else: ?>
            <p class="text-gray-600 mb-4">Nenhum treino vinculado a esta rotina.</p>
            <a href="selecionar-treino.php?idrotina=<?= htmlspecialchars($idRotina) ?>" 
               class="block w-full py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition">
               Adicionar Treinos
            </a>
        <?php endif; ?>
    </div>
</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?= date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>

</body>
</html>