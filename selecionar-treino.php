<?php
session_start();
require 'conexao.php';

// Verifica login
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$idUsuario = $_SESSION['usuario']['id'] ?? $_SESSION['usuario_id'] ?? null;
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

// Recebe treinos já adicionados temporariamente à rotina
$treinosRotina = $_SESSION['treinos_rotina'] ?? [];

// ======================
// Buscar treinos do BANCO
// ======================
$stmt = $pdo->prepare("SELECT idtreino, nome, dia_semana FROM treinos WHERE usuario_id = ?");
$stmt->execute([$idUsuario]);
$treinos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Processar seleção de treinos
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['treinos'])) {
    foreach ($_POST['treinos'] as $idTreinoSelecionado) {
        // Evitar duplicatas
        $alreadyAdded = false;
        foreach ($treinosRotina as $t) {
            if ($t['idtreino'] == $idTreinoSelecionado) {
                $alreadyAdded = true;
                break;
            }
        }

        if (!$alreadyAdded) {
            // Buscar treino do banco
            foreach ($treinos as $t) {
                if ($t['idtreino'] == $idTreinoSelecionado) {
                    $treinosRotina[] = $t;
                    break;
                }
            }
        }
    }

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

    <!-- Card de seleção -->
    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg mb-6">
        <h2 class="text-2xl font-bold mb-4 text-center">Selecionar Treinos para a Rotina</h2>

        <?php if ($treinos): ?>
        <form method="POST">
            <div class="max-h-[400px] overflow-y-auto space-y-3 mb-4">
                <?php foreach ($treinos as $t): ?>
                    <label class="group relative block border p-4 rounded-lg cursor-pointer transition 
                                hover:bg-green-50 hover:shadow-md text-center">
                        
                        <!-- Checkbox invisível mas funcional -->
                        <input type="checkbox" 
                            name="treinos[]" 
                            value="<?= htmlspecialchars($t['idtreino']) ?>" 
                            class="absolute inset-0 opacity-0 cursor-pointer peer">
                        
                        <!-- Conteúdo centralizado -->
                        <div class="flex flex-col items-center justify-center space-y-1">
                            <span class="text-lg font-semibold text-gray-900">
                                <?= htmlspecialchars($t['nome']) ?>
                            </span>
                            <span class="text-sm text-gray-500">
                                <?= htmlspecialchars($t['dia_semana']) ?> dias/semana
                            </span>
                        </div>

                        <!-- Check visual -->
                        <div class="absolute top-2 right-2 w-5 h-5 border-2 border-gray-400 rounded-md 
                                    flex items-center justify-center peer-checked:border-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
                                fill="currentColor" class="w-4 h-4 text-green-600 hidden peer-checked:block">
                                <path fill-rule="evenodd" 
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" 
                                    clip-rule="evenodd" />
                            </svg>
                        </div>

                        <!-- Fundo de destaque quando selecionado -->
                        <div class="absolute inset-0 rounded-lg bg-green-100 opacity-0 peer-checked:opacity-100 transition"></div>
                    </label>
                <?php endforeach; ?>
            </div>

            <button type="submit" 
                    class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Adicionar Selecionados
            </button>
        </form>


        <?php else: ?>
            <p class="text-gray-600 text-center mb-4">Você ainda não possui treinos criados.</p>
        <?php endif; ?>
    </div>

</main>
</body>
</html>