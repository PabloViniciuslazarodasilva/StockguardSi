document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('recovery-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('recoveryEmail').value.trim();
        const newSenha = document.getElementById('newSenha').value.trim();

        if (email === '' || newSenha === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioIndex = usuarios.findIndex(user => user.email === email);

        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex].senha = newSenha;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            alert('Senha atualizada com sucesso!');
            // Redirecione para a página de login ou outra página apropriada
            window.location.href = '/public/Stockguard - tela de login/tela.html'; // Substitua pelo caminho real da página de login
        } else {
            alert('Email não encontrado.');
        }
    });
});
