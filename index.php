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

        <div class="flex items-center gap-3">
            <a href="config.php"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
                Configurações
            </a>
            <a href="logout.php"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors">
                Sair
            </a>
        </div>
    </div>
</header>


<main class="flex-1 p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Bem-vindo, <?php echo htmlspecialchars($nomeUsuario); ?>!</h1>
    <p>Este é o painel inicial da sua aplicação LogFit.</p>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Bloco Nutrição -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
            <h2 class="text-xl font-semibold mb-2">Nutrição</h2>
            <p class="text-gray-600">Controle sua dieta e alimentação para melhores resultados.</p>
        </div>

        <!-- Bloco Treino -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
            <h2 class="text-xl font-semibold mb-2">Treino</h2>
            <p class="text-gray-600">Acompanhe seus treinos e progrida com segurança.</p>
        </div>

        <!-- Bloco Acompanhamento -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
            <h2 class="text-xl font-semibold mb-2">Acompanhamento</h2>
            <p class="text-gray-600">Monitore seus resultados e hábitos ao longo do tempo.</p>
        </div>
    </div>
    <div class="mt-10 bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-center">Progresso Mensal</h2>

    <!-- Barra de progresso -->
    <div class="w-full bg-gray-200 rounded-full h-6">
        <div class="bg-green-500 h-6 rounded-full text-center text-white text-sm font-bold" style="width: 65%;">
            65%
        </div>
    </div>

    <p class="text-gray-600 text-center mt-3">Seu progresso este mês</p>
</div>
</main>

    <footer class="bg-gray-900 p-4 text-center text-white">
        &copy; <?php echo date('Y'); ?> LogFit. Todos os direitos reservados.
    </footer>
</body>

</html>
