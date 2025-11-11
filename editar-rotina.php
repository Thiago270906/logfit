<?php
session_start();
require_once 'conexao.php';

// Verifica se está logado
if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];

// Verifica se a rotina foi passada
if (!isset($_GET['id'])) {
    header('Location: alterar-rotina.php');
    exit;
}

$idrotina = (int)$_GET['id'];

// Busca dados da rotina
$stmt = $pdo->prepare("SELECT * FROM rotinas WHERE idrotina = ? AND usuario_id = ?");
$stmt->execute([$idrotina, $usuario_id]);
$rotina = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$rotina) {
    header('Location: alterar-rotina.php');
    exit;
}

// Atualiza dados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'] ?? '';
    $dias_semana = $_POST['dias_semana'] ?? '';
    $data_inicio = $_POST['data_inicio'] ?? null;
    $data_fim = $_POST['data_fim'] ?? null;

    $stmt = $pdo->prepare("
        UPDATE rotinas
        SET nome = ?, dias_semana = ?, data_inicio = ?, data_fim = ?
        WHERE idrotina = ? AND usuario_id = ?
    ");
    $stmt->execute([$nome, $dias_semana, $data_inicio, $data_fim, $idrotina, $usuario_id]);

    $_SESSION['msg_sucesso'] = "Rotina atualizada com sucesso!";
    header("Location: alterar-rotina.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Editar Rotina - LogFit</title>
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
    <a href="alterar-rotina.php" class="flex items-center gap-2 px-4 py-2 font-medium mb-4">
        <img src="image/seta-esquerda.png" class="w-5 h-5">
        Voltar
    </a>

    <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4 text-center">Editar Rotina</h2>

        <form method="POST" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Nome da Rotina</label>
                <input type="text" name="nome" value="<?= htmlspecialchars($rotina['nome']) ?>"
                       class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Dias por Semana</label>
                <input type="number" name="dias_semana" value="<?= htmlspecialchars($rotina['dias_semana']) ?>"
                       class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Data de Início</label>
                <input type="date" name="data_inicio" value="<?= htmlspecialchars($rotina['data_inicio']) ?>"
                       class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Data de Fim</label>
                <input type="date" name="data_fim" value="<?= htmlspecialchars($rotina['data_fim']) ?>"
                       class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            </div>

            <!-- Botão para abrir a edição dos treinos vinculados -->
            <div class="mb-6 text-center">
                <a href="editar-rotina-treino.php?id=<?= htmlspecialchars($idrotina) ?>"
                class="w-full inline-block px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition">
                    Editar Treinos
                </a>
            </div>

            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                Salvar Alterações
            </button>
        </form>
    </div>
</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?= date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>

</body>
</html>