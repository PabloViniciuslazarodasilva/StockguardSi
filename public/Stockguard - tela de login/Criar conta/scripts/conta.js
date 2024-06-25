document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

        if (nome === '' || email === '' || senha === '' || confirmarSenha === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const usuario = {
            nome: nome,
            email: email,
            senha: senha
        };

        try {
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios.push(usuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('Usuário cadastrado com sucesso!');
            window.location.href = '/public/Stockguard - tela de login/tela.html'; // Substitua pelo caminho real da página de login
            form.reset();
        } catch (error) {
            console.error('Erro:', error);
            alert('Houve um problema ao cadastrar o usuário.');
        }
    });
});
