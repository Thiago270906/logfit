<?php
session_start();
require_once "conexao.php"; 

if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header("Location: login.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: dieta.php");
    exit;
}

if (!isset($_POST['id_dieta'])) {
    header("Location: dieta.php?erro=id");
    exit;
}

$id = intval($_POST['id_dieta']);
$usuario_id = $_SESSION['usuario']['id']; // segurança: deleta só a dieta do usuário

try {
    $stmt = $pdo->prepare("DELETE FROM dietas WHERE iddieta = ? AND usuario_id = ? LIMIT 1");
    $stmt->execute([$id, $usuario_id]);

    if ($stmt->rowCount() > 0) {
        header("Location: dieta.php?msg=deletado");
    } else {
        header("Location: dieta.php?erro=notfound");
    }

} catch (PDOException $e) {
    header("Location: dieta.php?erro=banco");
}
exit;
