<?php
session_start();
require 'conexao.php';

// segurança: usuário logado
if (empty($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// obtém id do usuário
$usuarioId = $_SESSION['usuario']['id'] ?? $_SESSION['usuario_id'] ?? null;
if (!$usuarioId) {
    echo "<p style='color:red;'>Erro: usuário não identificado na sessão. Faça login novamente.</p>";
    exit;
}

// pega exercícios selecionados da etapa anterior
$exerciciosSelecionados = $_SESSION['exercicios_treino'] ?? [];
if (empty($exerciciosSelecionados)) {
    header('Location: selecionar-exercicios.php');
    exit;
}

// PROCESSAMENTO do formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nomeTreino = trim($_POST['nome_treino'] ?? '');
    $diaSemana = $_POST['dia_semana'] ?? null;
    $descansoPadrao = intval($_POST['descanso_padrao'] ?? 60);

    if ($nomeTreino === '') {
        $_SESSION['msg_erro_confirmar'] = "Informe o nome do treino.";
        header('Location: confirmar-exercicios.php');
        exit;
    }

    try {
        $pdo->beginTransaction();

        // 1) Insere treino
        $stmtTreino = $pdo->prepare("
            INSERT INTO treinos (usuario_id, nome, dia_semana, descanso_padrao_seg)
            VALUES (?, ?, ?, ?)
        ");
        $stmtTreino->execute([$usuarioId, $nomeTreino, $diaSemana, $descansoPadrao]);
        $idTreino = $pdo->lastInsertId();

        // 2) Insere exercícios
        $stmtEx = $pdo->prepare("
            INSERT INTO treino_exercicios (treino_id, exercicio_id, nome_exercicio, series, repeticoes, carga_kg, descanso_seg)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($exerciciosSelecionados as $ex) {
            $id = $ex['id'];
            $series = intval($_POST["series_{$id}"] ?? 0);
            $repeticoes = trim($_POST["reps_{$id}"] ?? '');
            $carga = $_POST["carga_{$id}"] ?? null;
            $descanso = intval($_POST["descanso_{$id}"] ?? ($descansoPadrao));

            $cargaVal = ($carga === '' || $carga === null) ? null : str_replace(',', '.', $carga);

            $stmtEx->execute([
                $idTreino,
                $id,
                $ex['nome'],
                $series ?: null,
                $repeticoes ?: null,
                $cargaVal,
                $descanso ?: null
            ]);
        }

        $pdo->commit();

        unset($_SESSION['exercicios_treino']);
        $_SESSION['msg_sucesso'] = "Treino '{$nomeTreino}' salvo com sucesso!";
        header('Location: selecionar-treino.php');
        exit;

    } catch (Exception $e) {
        $pdo->rollBack();
        echo "<pre>Erro ao salvar treino: " . htmlspecialchars($e->getMessage()) . "</pre>";
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Confirmar Exercícios</title>
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
  <div class="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-4 text-center">Confirmar Exercícios</h1>

    <?php if (!empty($_SESSION['msg_erro_confirmar'])): ?>
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
        <?= htmlspecialchars($_SESSION['msg_erro_confirmar']); unset($_SESSION['msg_erro_confirmar']); ?>
      </div>
    <?php endif; ?>

    <form method="POST" class="space-y-6">
      <div>
        <label class="block font-semibold mb-1">Nome do Treino</label>
        <input type="text" name="nome_treino" required
               class="w-full px-3 py-2 border rounded-lg"
               placeholder="Ex: Dia A — Peito/Tríceps">
      </div>

      <div>
        <label class="block font-semibold mb-1">Dia da semana (opcional)</label>
        <select name="dia_semana" class="w-48 px-3 py-2 border rounded-lg">
          <option value="">-- nenhum --</option>
          <option>Segunda</option>
          <option>Terça</option>
          <option>Quarta</option>
          <option>Quinta</option>
          <option>Sexta</option>
          <option>Sábado</option>
          <option>Domingo</option>
        </select>
      </div>

      <div>
        <label class="block font-semibold mb-1">Minutos de descanso padrão</label>
        <input type="number" name="descanso_padrao" min="10" max="600" value="60"
               class="w-40 px-3 py-2 border rounded-lg"
               placeholder="Ex: 60">
        <p class="text-sm text-gray-500 mt-1">Esse valor será aplicado automaticamente a todos os exercícios (pode ser alterado individualmente abaixo).</p>
      </div>

      <div class="border rounded-lg p-4 max-h-[480px] overflow-y-auto">
        <?php foreach ($exerciciosSelecionados as $ex): $id = $ex['id']; ?>
          <div class="mb-4 border-b pb-3">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold"><?= htmlspecialchars($ex['nome']) ?></p>
                <p class="text-sm text-gray-500"><?= htmlspecialchars($ex['grupo_muscular']) ?></p>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label class="block text-sm">Séries</label>
                <input type="number" name="series_<?= $id ?>" min="0" class="w-full px-2 py-1 border rounded">
              </div>

              <div>
                <label class="block text-sm">Repetições</label>
                <input type="text" name="reps_<?= $id ?>" placeholder="ex: 8-12 / AMRAP" class="w-full px-2 py-1 border rounded">
              </div>

              <div>
                <label class="block text-sm">Carga (kg)</label>
                <input type="text" name="carga_<?= $id ?>" placeholder="ex: 60.5" class="w-full px-2 py-1 border rounded">
              </div>

              <div>
                <label class="block text-sm">Descanso (seg)</label>
                <input type="number" name="descanso_<?= $id ?>" min="0" class="w-full px-2 py-1 border rounded">
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

      <div class="flex justify-between items-center">
        <a href="selecionar-exercicios.php" class="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg">Voltar</a>
        <button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">Criar Treino</button>
      </div>
    </form>
  </div>
</main>
<footer class="bg-gray-900 p-4 text-center text-white">
    &copy; <?php echo date('Y'); ?> LogFit. Todos os direitos reservados.
</footer>
</body>
</html>