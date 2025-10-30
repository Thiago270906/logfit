<?php
session_start();

// Verifica se usuário está logado
if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header('Location: login.php');
    exit;
}

// Obtém dados do usuário logado
$nomeUsuario = $_SESSION['usuario']['nome'] ?? 'Usuário';
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Painel Inicial - LogFit</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 min-h-screen flex flex-col">
    <header class="bg-gray-900 py-2 px-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <img src="image/logo-logfit.png" alt="logo" class="h-20 max-w-xs object-contain" />
            <a href="logout.php"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors">
                Sair
            </a>
        </div>
    </header>

    <main class="flex-1 p-6 max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-4">Bem-vindo, <?php echo htmlspecialchars($nomeUsuario); ?>!</h1>
        <p>Este é o painel inicial da sua aplicação LogFit.</p>

        <!-- Aqui poderá adicionar dashboards, gráficos, listas, etc -->
    </main>

    <footer class="bg-gray-900 p-4 text-center text-white">
        &copy; <?php echo date('Y'); ?> LogFit. Todos os direitos reservados.
    </footer>
</body>

</html>
