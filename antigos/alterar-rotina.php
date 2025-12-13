<?php
session_start();
require_once 'conexao.php';

// Verificação de login
if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];

// Buscar o treino ativo
$stmt = $pdo->prepare("
    SELECT idrotina, nome, dias_semana, data_inicio, data_fim 
    FROM rotinas 
    WHERE usuario_id = ? AND ativa = 1 
    LIMIT 1
");
$stmt->execute([$usuario_id]);
$treinoAtivo = $stmt->fetch(PDO::FETCH_ASSOC);

// Buscar outros treinos disponíveis
$stmt = $pdo->prepare("
    SELECT idrotina, nome, dias_semana, data_inicio, data_fim 
    FROM rotinas 
    WHERE usuario_id = ? AND ativa = 0
    ORDER BY data_inicio DESC
");
$stmt->execute([$usuario_id]);
$outrosTreinos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Desativar treino atual
if (isset($_POST['acao']) && $_POST['acao'] === 'desativar') {
    $pdo->prepare("UPDATE rotinas SET ativa = 0 WHERE usuario_id = ?")->execute([$usuario_id]);
    $_SESSION['msg_sucesso'] = "Treino desativado com sucesso.";
    header("Location: treino.php");
    exit;
}

// Ativar um treino já existente
if (isset($_POST['acao']) && $_POST['acao'] === 'ativar' && isset($_POST['treino_id'])) {

    $pdo->prepare("UPDATE rotinas SET ativa = 0 WHERE usuario_id = ?")->execute([$usuario_id]);

    $pdo->prepare("
        UPDATE rotinas 
        SET ativa = 1, data_ativacao = NOW() 
        WHERE idrotina = ? AND usuario_id = ?
    ")->execute([$_POST['treino_id'], $usuario_id]);

    $_SESSION['msg_sucesso'] = "Novo treino ativado com sucesso.";
    header("Location: treino.php");
    exit;
}

// Excluir rotina específica
if (isset($_POST['acao']) && $_POST['acao'] === 'excluir' && isset($_POST['treino_id'])) {
    $treino_id = intval($_POST['treino_id']);

    // Exclui vínculos de treinos e exercícios antes de remover a rotina principal
    $pdo->prepare("DELETE FROM rotina_treinos WHERE rotina_id = ?")->execute([$treino_id]);
    $pdo->prepare("DELETE FROM rotinas WHERE idrotina = ? AND usuario_id = ?")->execute([$treino_id, $usuario_id]);

    $_SESSION['msg_sucesso'] = "Rotina excluída com sucesso.";
    header("Location: alterar-rotina.php");
    exit;
}

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Alterar Treino - LogFit</title>
<link rel="icon" type="image/png" href="image/logo-logfit.png">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">

<header class="bg-gray-900 py-2 px-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
        <img src="image/logo-logfit.png" alt="logo" class="h-20 max-w-xs object-contain" />

        <div class="flex items-center gap-3">
            <a href="config.php">
                <img src="image/config.png" alt="config" class="h-10 max-w-xs object-contain">
            </a>
            <a href="logout.php">
                <img src="image/sair.png" alt="sair" class="h-10 max-w-xs object-contain">
            </a>
        </div>
    </div>
</header>

<main class="flex-1 p-6">

    <div class="flex justify-between items-center mb-6">

        <a href="treino.php" 
           class ="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">

        <h2 class="text-2xl font-semibold mb-6 text-center">Alterar Treino</h2>

        <?php if ($treinoAtivo): ?>
            <div class="border p-4 rounded-lg mb-6 bg-gray-50">
                <h3 class="text-lg font-bold text-gray-800 mb-1"><?= htmlspecialchars($treinoAtivo['nome']) ?></h3>
                <p class="text-gray-600 mb-1">Dias por semana: <?= htmlspecialchars($treinoAtivo['dias_semana']) ?></p>
                <p class="text-gray-500 text-sm mb-1">
                    Início: <?= date('d/m/Y', strtotime($treinoAtivo['data_inicio'])) ?>
                    <?php if ($treinoAtivo['data_fim']): ?>
                        - Fim: <?= date('d/m/Y', strtotime($treinoAtivo['data_fim'])) ?>
                    <?php endif; ?>
                </p>

                <form method="POST" class="mt-3">
                    <input type="hidden" name="acao" value="desativar">
                    <button type="submit"
                        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition">
                        Desativar Treino Atual
                    </button>
                </form>
            </div>
        <?php else: ?>
            <p class="text-center text-gray-600 mb-6">Você não possui um treino ativo no momento.</p>
        <?php endif; ?>

        <h3 class="text-lg font-semibold mb-4 text-gray-800">Outros Treinos</h3>

        <?php if ($outrosTreinos): ?>
            <form method="POST" class="space-y-3" id="form-ativar-treino">
                <?php foreach ($outrosTreinos as $t): ?>
                    <div class="flex justify-between items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100">
                        <div>
                            <p class="font-semibold text-gray-800"><?= htmlspecialchars($t['nome']) ?></p>
                            <p class="text-sm text-gray-500">
                                <?= htmlspecialchars($t['dias_semana']) ?> dias —
                                Início: <?= date('d/m/Y', strtotime($t['data_inicio'])) ?>
                            </p>
                        </div>

                        <div class="flex gap-3 items-center">
                            <!-- Radio -->
                            <input 
                                type="radio" 
                                name="treino_id" 
                                value="<?= $t['idrotina'] ?>" 
                                class="w-5 h-5 accent-green-600 cursor-pointer"
                            >

                            <!-- Botão Editar -->
                            <a href="editar-rotina.php?id=<?= $t['idrotina'] ?>" 
                            class="flex items-center justify-center text-white rounded-md p-2 transition duration-200">
                                <img src="image/botao-editar.png" alt="Editar" class="w-5 h-5">
                            </a>

                            <!-- Botão Excluir (via JS) -->
                            <button type="button" 
                                    onclick="excluirRotina(<?= $t['idrotina'] ?>)"
                                    class="p-2 rounded-md transition">
                                <img src="image/lixeira.png" alt="Excluir" class="w-5 h-5">
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>

                <input type="hidden" name="acao" value="ativar">
                <button type="submit"
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition">
                    Ativar Treino Selecionado
                </button>
            </form>
        <?php else: ?>
            <p class="text-gray-600 mb-6">Nenhum outro treino salvo encontrado.</p>
        <?php endif; ?>

        <div class="mt-8 text-center">
            <a href="nova-rotina.php" class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md">
                Criar Novo Treino
            </a>
        </div>

        <!-- Script para exclusão -->
        <script>
        function excluirRotina(id) {
            if (!confirm("Tem certeza que deseja excluir esta rotina?")) return;

            const formData = new FormData();
            formData.append('acao', 'excluir');
            formData.append('treino_id', id);

            fetch('alterar-rotina.php', {
                method: 'POST',
                body: formData
            })
            .then(() => window.location.reload());
        }
        </script>
    </div>
</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?php echo date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>

</body>
</html>