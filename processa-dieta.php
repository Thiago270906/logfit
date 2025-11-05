<?php
session_start();
require_once 'conexao.php'; // Conexão PDO

// Verifica login
if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header("Location: login.php");
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sanitização básica
    $nome_dieta   = trim($_POST['nome_dieta'] ?? '');
    $kcal_total   = (int)($_POST['kcal_total'] ?? 0);
    $agua_ml      = (int)($_POST['agua_ml'] ?? 0);
    $cafe_manha   = trim($_POST['cafe_manha'] ?? '');
    $lanche_manha = trim($_POST['lanche_manha'] ?? '');
    $almoco       = trim($_POST['almoco'] ?? '');
    $lanche_tarde = trim($_POST['lanche_tarde'] ?? '');
    $janta        = trim($_POST['janta'] ?? '');
    $ceia         = trim($_POST['ceia'] ?? '');
    
    // Validações simples
    if (empty($nome_dieta) || $kcal_total <= 0 || $agua_ml <= 0) {
        $_SESSION['erro_dieta'] = "Preencha todos os campos obrigatórios corretamente.";
        header("Location: nova-dieta.php");
        exit;
    }

    try {
        $sql = "INSERT INTO dietas 
            (usuario_id, nome_dieta, kcal_total, agua_ml, cafe_manha, lanche_manha, almoco, lanche_tarde, janta, ceia, data_criacao)
            VALUES (:usuario_id, :nome_dieta, :kcal_total, :agua_ml, :cafe_manha, :lanche_manha, :almoco, :lanche_tarde, :janta, :ceia, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':usuario_id'   => $usuario_id,
            ':nome_dieta'   => $nome_dieta,
            ':kcal_total'   => $kcal_total,
            ':agua_ml'      => $agua_ml,
            ':cafe_manha'   => $cafe_manha,
            ':lanche_manha' => $lanche_manha,
            ':almoco'       => $almoco,
            ':lanche_tarde' => $lanche_tarde,
            ':janta'        => $janta,
            ':ceia'         => $ceia
        ]);

        $_SESSION['sucesso_dieta'] = "Dieta criada com sucesso!";
        header("Location: dieta.php");
        exit;

    } catch (PDOException $e) {
        $_SESSION['erro_dieta'] = "Erro ao salvar a dieta: " . $e->getMessage();
        header("Location: nova-dieta.php");
        exit;
    }
} else {
    header("Location: nova-dieta.php");
    exit;
}
