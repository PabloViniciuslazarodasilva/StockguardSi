const apiUrl = 'http://localhost:3000/usuarios';

// Adicionar usuário
async function addUser(user) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    return response.json();
}

// Obter todos os usuários
async function getUsers() {
    const response = await fetch(apiUrl);
    return response.json();
}

// Atualizar usuário
async function updateUser(id, updatedUser) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    });
    return response.json();
}

// Excluir usuário
async function deleteUser(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

// Função para inicializar o mapa
function initMap() {
    const pucMinasBarreiro = { lat: -19.975656, lng: -44.020467 };
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pucMinasBarreiro
    });
    const marker = new google.maps.Marker({
        position: pucMinasBarreiro,
        map: map
    });
}