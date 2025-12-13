<?php
session_start();
require 'conexao.php';

// Verifica se usuário está logado
$idusuario = $_SESSION['usuario']['id'] ?? null;
$novoTreino = $_SESSION['novo_treino'] ?? null;

if (!$idusuario || !$novoTreino) {
    header('Location: nova-rotina.php');
    exit;
}

// Recebe os exercícios selecionados
$exerciciosSelecionados = $_POST['exercicios'] ?? [];

try {
    // Inicia transação
    $pdo->beginTransaction();

    // Calcula data final automaticamente somando a duração em semanas à data de início
    $data_inicio = $novoTreino['data_inicio'];
    $duracao_semanas = $novoTreino['duracao_semanas'];
    $data_fim = date('Y-m-d', strtotime("+$duracao_semanas week", strtotime($data_inicio)));

    // Inserir rotina
    $sql = "INSERT INTO rotinas (usuario_id, nome, dias_semana, duracao_semanas, data_inicio, data_fim, ativa)
            VALUES (?, ?, ?, ?, ?, ?, 1)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $idusuario,
        $novoTreino['nome'],
        $novoTreino['dias_semana'],
        $duracao_semanas,
        $data_inicio,
        $data_fim
    ]);

    $idrotina = $pdo->lastInsertId();

    // Inserir exercícios selecionados
    foreach ($exerciciosSelecionados as $idex) {
        $stmt = $pdo->prepare("INSERT INTO rotina_exercicios (dia_id, exercicio_id, nome_exercicio, series, repeticoes, descanso_seg)
                               VALUES (?, ?, ?, ?, ?, ?)");
        // Por enquanto associamos ao dia 1, sem nome, séries, repetições ou descanso
        $stmt->execute([1, $idex, '', 3, '10-12', 60]);
    }

    // Confirma transação
    $pdo->commit();

    // Limpa sessão temporária
    unset($_SESSION['novo_treino']);

    // Redireciona para a tela de treino
    header('Location: treino.php');
    exit;

} catch (PDOException $e) {
    $pdo->rollBack();
    echo "Erro ao salvar treino: " . $e->getMessage();
    exit;
}
