<?php
session_start();
require 'conexao.php';

// Verifica login
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$idUsuario = $_SESSION['usuario']['id'] ?? $_SESSION['usuario_id'] ?? $_SESSION['idusuario'] ?? null;
if (!$idUsuario) {
    echo "<p style='color:red;'>Erro: usuário não identificado na sessão. Faça login novamente.</p>";
    exit;
}

// Verifica se há rotina temporária
$novaRotina = $_SESSION['nova_rotina'] ?? null;
if (!$novaRotina) {
    header('Location: nova-rotina.php');
    exit;
}

// Treinos já adicionados à rotina (sessão temporária)
$treinosRotina = $_SESSION['treinos_rotina'] ?? [];

// ======================
// Buscar treinos do BANCO
// ======================
$stmt = $pdo->prepare("SELECT idtreino, nome, dia_semana FROM treinos WHERE usuario_id = ?");
$stmt->execute([$idUsuario]);
$treinos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ======================
// Processar seleção
// ======================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['treinos'])) {
    $treinosSelecionados = array_map('intval', $_POST['treinos']);

    foreach ($treinosSelecionados as $idTreinoSelecionado) {
        // Evita duplicatas
        $jaAdicionado = false;
        foreach ($treinosRotina as $t) {
            if ($t['idtreino'] == $idTreinoSelecionado) {
                $jaAdicionado = true;
                break;
            }
        }

        // Adiciona se ainda não estiver na lista
        if (!$jaAdicionado) {
            foreach ($treinos as $t) {
                if ($t['idtreino'] == $idTreinoSelecionado) {
                    $treinosRotina[] = $t;
                    break;
                }
            }
        }
    }

    // Atualiza sessão
    $_SESSION['treinos_rotina'] = $treinosRotina;

    header('Location: nova-rotina-treino.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Selecionar Treinos</title>
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

    <!-- Botões -->
    <div class="w-full mb-6 flex justify-between items-center">
        <a href="nova-rotina-treino.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>

        <a href="selecionar-exercicios.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition bg-gray-400 hover:bg-gray-500 text-white">
            Criar Novo Treino
        </a>
    </div>

    <!-- Card principal -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-6 text-center">Selecionar Treinos para a Rotina</h2>

        <?php if ($treinos): ?>
        <form method="POST">
            <div class="max-h-[400px] overflow-y-auto space-y-3 mb-6">
                <?php foreach ($treinos as $t): ?>
                <label class="flex items-center justify-between border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition peer-checked:border-green-600">
                    <div class="flex flex-col flex-1 text-left">
                        <span class="text-lg font-semibold text-gray-900">
                            <?= htmlspecialchars($t['nome']) ?>
                        </span>
                        <span class="text-sm text-gray-500">
                            <?= htmlspecialchars($t['dia_semana'] ?: 'Dia não definido') ?>
                        </span>
                    </div>

                    <!-- Checkbox padrão -->
                    <input type="checkbox" 
                        name="treinos[]" 
                        value="<?= htmlspecialchars($t['idtreino']) ?>" 
                        class="w-6 h-6 accent-green-600 border-gray-400 rounded-md focus:ring-green-500 cursor-pointer transition">

                </label>
                <?php endforeach; ?>
            </div>

            <button type="submit" 
                    class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Confirmar Selecionados
            </button>
        </form>
        <?php else: ?>
            <p class="text-gray-600 text-center mb-4">Você ainda não possui treinos criados.</p>
        <?php endif; ?>
    </div>
</main>
<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?php echo date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>
</body>
</html>