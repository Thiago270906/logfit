<?php
session_start();
require 'conexao.php';

// Segurança: usuário logado
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// Garante o ID do usuário logado
$usuarioId = $_SESSION['usuario']['id'] ?? $_SESSION['usuario_id'] ?? null;
if (!$usuarioId) {
    echo "<p style='color:red;'>Erro: usuário não identificado na sessão. Faça login novamente.</p>";
    exit;
}

// Pega os IDs de treino e rotina
$idTreino = isset($_GET['idtreino']) ? (int)$_GET['idtreino'] : 0;
$idRotina = $_GET['idrotina'] ?? null;

if ($idTreino <= 0) {
    header('Location: selecionar-treino.php');
    exit;
}

// Verifica se o treino pertence ao usuário
$stmtTreino = $pdo->prepare("SELECT * FROM treinos WHERE idtreino = ? AND usuario_id = ?");
$stmtTreino->execute([$idTreino, $usuarioId]);
$treino = $stmtTreino->fetch(PDO::FETCH_ASSOC);

if (!$treino) {
    echo "<p style='color:red;'>Treino não encontrado ou sem permissão.</p>";
    exit;
}

// Atualização dos exercícios
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo->beginTransaction();

        // Atualiza o treino principal
        $nomeTreino = trim($_POST['nome_treino'] ?? '');
        $diaSemana = $_POST['dia_semana'] ?? null;
        $descansoPadrao = intval($_POST['descanso_padrao'] ?? 60);

        $stmtUpTreino = $pdo->prepare("
            UPDATE treinos 
            SET nome = ?, dia_semana = ?, descanso_padrao_seg = ?
            WHERE idtreino = ? AND usuario_id = ?
        ");
        $stmtUpTreino->execute([$nomeTreino, $diaSemana, $descansoPadrao, $idTreino, $usuarioId]);

        // Atualiza cada exercício vinculado
        foreach ($_POST['exercicio_id'] as $exId) {
            $series = intval($_POST["series_$exId"] ?? 0);
            $reps = trim($_POST["reps_$exId"] ?? '');
            $carga = str_replace(',', '.', ($_POST["carga_$exId"] ?? ''));
            $descanso = intval($_POST["descanso_$exId"] ?? $descansoPadrao);

            $stmtUp = $pdo->prepare("
                UPDATE treino_exercicios
                SET series = ?, repeticoes = ?, carga_kg = ?, descanso_seg = ?
                WHERE idtreino_ex = ? AND treino_id = ?
            ");
            $stmtUp->execute([$series, $reps, $carga ?: null, $descanso, $exId, $idTreino]);
        }

        $pdo->commit();

        // Redireciona corretamente de volta para a rotina
        $_SESSION['msg_sucesso'] = "Treino atualizado com sucesso!";
        header("Location: editar-rotina-treino.php?idrotina=" . urlencode($idRotina));
        exit;

    } catch (Exception $e) {
        $pdo->rollBack();
        echo "<pre>Erro ao atualizar: " . htmlspecialchars($e->getMessage()) . "</pre>";
    }
}

// Busca exercícios do treino
$stmtEx = $pdo->prepare("
    SELECT idtreino_ex, nome_exercicio, series, repeticoes, carga_kg, descanso_seg
    FROM treino_exercicios
    WHERE treino_id = ?
");
$stmtEx->execute([$idTreino]);
$exercicios = $stmtEx->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Editar Exercícios</title>
<link rel="icon" type="image/png" href="image/logo-logfit.png">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">

<!-- Cabeçalho -->
<header class="bg-gray-900 py-2 px-4">
  <div class="max-w-7xl mx-auto flex justify-center">
    <img src="image/logo-logfit.png" alt="logo" class="h-20 object-contain" />
  </div>
</header>

<main class="flex-1 p-6 flex flex-col items-center">
  <div class="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-4 text-center">Editar Exercícios</h1>

    <form method="POST" class="space-y-6">
      <div>
        <label class="block font-semibold mb-1">Nome do Treino</label>
        <input type="text" name="nome_treino" value="<?= htmlspecialchars($treino['nome']) ?>" required
               class="w-full px-3 py-2 border rounded-lg">
      </div>

      <div>
        <label class="block font-semibold mb-1">Dia da Semana</label>
        <select name="dia_semana" class="w-48 px-3 py-2 border rounded-lg">
          <option value="">-- nenhum --</option>
          <?php 
          $dias = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
          foreach ($dias as $d): ?>
            <option value="<?= $d ?>" <?= ($treino['dia_semana'] === $d) ? 'selected' : '' ?>><?= $d ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div>
        <label class="block font-semibold mb-1">Descanso Padrão (segundos)</label>
        <input type="number" name="descanso_padrao" value="<?= htmlspecialchars($treino['descanso_padrao_seg']) ?>" 
               min="10" max="600" class="w-40 px-3 py-2 border rounded-lg">
      </div>

      <div class="border rounded-lg p-4 max-h-[480px] overflow-y-auto">
        <?php foreach ($exercicios as $ex): $exId = $ex['idtreino_ex']; ?>
          <input type="hidden" name="exercicio_id[]" value="<?= $exId ?>">
          <div class="mb-4 border-b pb-3">
            <p class="font-semibold text-gray-800"><?= htmlspecialchars($ex['nome_exercicio']) ?></p>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label class="block text-sm">Séries</label>
                <input type="number" name="series_<?= $exId ?>" min="0"
                       value="<?= htmlspecialchars($ex['series']) ?>" class="w-full px-2 py-1 border rounded">
              </div>

              <div>
                <label class="block text-sm">Repetições</label>
                <input type="text" name="reps_<?= $exId ?>" value="<?= htmlspecialchars($ex['repeticoes']) ?>"
                       class="w-full px-2 py-1 border rounded">
              </div>

              <div>
                <label class="block text-sm">Carga (kg)</label>
                <input type="text" name="carga_<?= $exId ?>" value="<?= htmlspecialchars($ex['carga_kg']) ?>"
                       class="w-full px-2 py-1 border rounded">
              </div>

              <div>
                <label class="block text-sm">Descanso (seg)</label>
                <input type="number" name="descanso_<?= $exId ?>" min="0"
                       value="<?= htmlspecialchars($ex['descanso_seg']) ?>" class="w-full px-2 py-1 border rounded">
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div> 
      
      <div class="flex justify-between items-center">
            <a href="editar-rotina-treino.php?idrotina=<?= htmlspecialchars($_GET['idrotina'] ?? '') ?>" class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
                <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
                    Voltar
            </a>

        <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
          Salvar Alterações
        </button>
      </div>
    </form>
  </div>
</main>

<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?= date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>
</body>
</html>