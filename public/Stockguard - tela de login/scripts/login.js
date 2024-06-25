document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const senha = document.getElementById('loginSenha').value.trim();

        if (email === '' || senha === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(user => user.email === email && user.senha === senha);

        if (usuario) {
            alert('Login bem-sucedido!');
            // Redirecione para a página principal ou outra página protegida
            window.location.href = '/public/Lembretes/index.html'; // Substitua pelo caminho real da página principal
        } else {
            alert('Email ou senha incorretos.');
        }
    });
});
