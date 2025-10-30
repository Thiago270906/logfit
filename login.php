<?php
session_start();
$titulo_pagina = "Login - Minha Loja";
$nome_desenvolvedor = "Seu Nome";
$ano_direitos = date("Y");
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title><?php echo $titulo_pagina; ?></title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">

<div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h1>
<form action="processa_login.php" method="POST" class="space-y-6">
<div>
    <label for="email" class="block mb-2 text-sm font-medium text-gray-700">E-mail</label>
    <input type="email" name="email" id="email" required class="w-full px-4 py-3 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />    
</div>
<div>
    <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Senha</label>
    <input type="password" name="password" id="password" required class="w-full px-4 py-3 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
</div>

   <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">

   <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold py-3 rounded-md shadow-md transition duration-300">Entrar</button>

   <div class="flex justify-between items-center text-sm">
        <a href="esqueci_senha.php" class="text-indigo-600 hover:text-indigo-800">Esqueci minha senha</a>
        <a href="cadastro.php" class="text-green-600 hover:text-green-800 font-semibold">Cadastrar</a>
    </div>
</form>
</div>

</body>
</html>

<?php if (isset($_SESSION['erro_login'])): ?>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <?php 
        echo $_SESSION['erro_login'];
        unset($_SESSION['erro_login']); // Limpa a mensagem após exibir
        ?>
    </div>
<?php endif; ?>