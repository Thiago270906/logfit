<?php if (isset($_SESSION['erro_cadastro'])): ?>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <?php 
        echo $_SESSION['erro_cadastro'];
        unset($_SESSION['erro_cadastro']);
        ?>
    </div>
<?php endif; ?>

<?php if (isset($_SESSION['sucesso_cadastro'])): ?>
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <?php 
        echo $_SESSION['sucesso_cadastro'];
        unset($_SESSION['sucesso_cadastro']);
        ?>
    </div>
<?php endif; ?>

<?php
session_start();
require_once 'conexao.php';

// Gera token CSRF
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Cadastro</title>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">

<form action="processa_cadastro.php" method="POST" class="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-6">

    <input type="hidden" name="csrf_token" 
           value="<?php echo $_SESSION['csrf_token']; ?>">

    <div>
        <label for="nome" class="block text-sm font-semibold text-gray-700 mb-1">
            Nome Completo
        </label>
        <input type="text" name="nome" id="nome" required minlength="3" maxlength="100"
               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    </div>

    <div>
        <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
            E-mail
        </label>
        <input type="email" name="email" id="email" required
               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    </div>

    <div>
        <label for="senha" class="block text-sm font-semibold text-gray-700 mb-1">
            Senha
        </label>
        <input type="password" name="senha" id="senha" required minlength="8"
               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <p class="mt-1 text-xs text-gray-500">
            Mínimo 8 caracteres, incluindo letras e números
        </p>
    </div>

    <div>
        <label for="confirma_senha" class="block text-sm font-semibold text-gray-700 mb-1">
            Confirme a Senha
        </label>
        <input type="password" name="confirma_senha" id="confirma_senha" required
               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    </div>

    <button type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors duration-200">
        Cadastrar
    </button>

</form>

</body>
</html>
