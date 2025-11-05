<?php
session_start();
require 'conexao.php';

if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

$idusuario = $_SESSION['usuario']['id'] ?? null;
if (!$idusuario) {
    header('Location: login.php');
    exit;
}

$idrotina = $_GET['idrotina'] ?? null;
if (!$idrotina) {
    header("Location: rotinas.php");
    exit;
}

// Buscar nome da rotina
$sql = $pdo->prepare("SELECT nome FROM rotinas WHERE id = :id AND idusuario = :idusuario");
$sql->execute(['id' => $idrotina, 'idusuario' => $idusuario]);
$rotina = $sql->fetch(PDO::FETCH_ASSOC);

if (!$rotina) {
    header("Location: rotinas.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Novo Treino</title>
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

    <div class="w-full mb-6">
        <a href="rotina.php?id=<?= htmlspecialchars($idrotina) ?>" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg text-center">
        <h2 class="text-2xl font-bold mb-6">Criar Treino para: <?= htmlspecialchars($rotina['nome']) ?></h2>

        <form action="processa-novo-treino.php" method="POST" class="space-y-4 text-left">

            <input type="hidden" name="idrotina" value="<?= $idrotina ?>">

            <div>
                <label class="block font-semibold mb-1">Nome do Treino (A, B, C...)</label>
                <input type="text" name="nome" placeholder="Treino A" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>

            <div>
                <label class="block font-semibold mb-1">Dia da Semana</label>
                <select name="dia_semana" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    <option value="">Selecione</option>
                    <option value="Segunda">Segunda</option>
                    <option value="Terça">Terça</option>
                    <option value="Quarta">Quarta</option>
                    <option value="Quinta">Quinta</option>
                    <option value="Sexta">Sexta</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                </select>
            </div>

            <button type="submit" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                Criar Treino
            </button>
        </form>
    </div>
</main>
</body>
</html>
