<?php
session_start();

// Verifica login
if (!isset($_SESSION['usuario_logado']) || $_SESSION['usuario_logado'] !== true) {
    header("Location: login.php");
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Criar Dieta - LogFit</title>
<link rel="icon" type="image/png" href="image/logo-logfit.png">
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 min-h-screen flex flex-col">
    
    <header class="bg-gray-900 py-2 px-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <img src="image/logo-logfit.png" alt="logo" class="h-20 max-w-xs object-contain" />
            <a href="logout.php"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition">
            Sair
        </a>
    </div>
</header>

<main class="flex-1 p-6">

    <!-- Botão Voltar alinhado à esquerda -->
    <div class="w-full mb-5">
        <a href="dieta.php" 
           class="flex items-center gap-2 px-4 py-2 font-medium rounded-md transition">
            <img src="image/seta-esquerda.png" class="w-5 h-5" alt="Voltar">
            Voltar
        </a>
    </div>

    <!-- Container centralizado do formulário -->
    <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold mb-6 text-center">Criar Nova Dieta</h2>

        <form action="processa-dieta.php" method="POST" class="bg-white p-6 rounded-lg shadow space-y-6">

            <!-- Grid principal: duas colunas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Coluna Esquerda -->
                <div class="space-y-4">
                    <div>
                        <label class="block font-semibold mb-1">Nome da Dieta</label>
                        <input type="text" name="nome_dieta" required
                               class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="Ex: Bulking, Cutting, Manutenção">
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Calorias Diárias (kcal)</label>
                        <input type="number" name="kcal_total" required min="1000" max="8000"
                               class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="Ex: 2500">
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Água por Dia (ml)</label>
                        <input type="number" name="agua_ml" required min="500" max="10000"
                               class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                               placeholder="Ex: 3500">
                    </div>
                </div>

                <!-- Coluna Direita -->
                <div class="space-y-4">
                    <div>
                        <label class="block font-semibold mb-1">Café da Manhã</label>
                        <textarea name="cafe_manha" rows="3"
                                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Ex: Aveia, ovo, banana"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Lanche da Manhã</label>
                        <textarea name="lanche_manha" rows="3"
                                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Ex: Iogurte, castanhas"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Almoço</label>
                        <textarea name="almoco" rows="3"
                                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Ex: Arroz, frango, salada"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Lanche da Tarde</label>
                        <textarea name="lanche_tarde" rows="3"
                                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Ex: Frutas, whey protein"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Janta</label>
                        <textarea name="janta" rows="3"
                                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Ex: Peixe, legumes, batata"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Ceia</label>
                        <textarea name="ceia" rows="3"
                                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Ex: Queijo cottage, castanhas"></textarea>
                    </div>
                </div>

            </div>

            <!-- Botão Salvar -->
            <div>
                <button type="submit"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition">
                    ✅ Salvar Dieta
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
