document.addEventListener('DOMContentLoaded', (event) => {
    // Obtém o ID do produto a partir da URL
    let productId = new URLSearchParams(window.location.search).get('id');
    
    // Se houver um ID de produto, carrega os detalhes do produto
    if (productId) {
        let productDetails = getProductDetails(productId);
        
        // Se os detalhes do produto forem encontrados, preenche os campos da página
        if (productDetails) {
            document.getElementById('productCode').textContent = `Código: ${productDetails.codigo}`;
            document.getElementById('productName').textContent = `Nome: ${productDetails.nome}`;
            document.getElementById('productDescription').textContent = `Descrição: ${productDetails.descricao}`;
            document.getElementById('productPrice').textContent = `Preço: R$${productDetails.preco}`;
            document.getElementById('productQuantity').textContent = `Quantidade em Estoque: ${productDetails.quantidade} unidades`;
            document.getElementById('productEntryDate').textContent = `Data de Entrada: ${productDetails.dataEntrada}`;
            document.getElementById('productExpirationDate').textContent = `Data de Vencimento: ${productDetails.dataVencimento}`;
            
            // Chama a função para carregar os gráficos, passando o nome do produto
            carregarGraficos(productDetails.nome);
        }
    }
});

// Função para obter os detalhes do produto a partir do localStorage
function getProductDetails(productId) {
    let strDados = localStorage.getItem('db');
    
    // Se houver dados no localStorage, retorna os detalhes do produto
    if (strDados) {
        let objDados = JSON.parse(strDados);
        return objDados.produtos[productId];
    }
    return null;
}

// Função para carregar os gráficos de vencimento do produto
function carregarGraficos(nomeProduto) {
    let strDados = localStorage.getItem('db');
    let objDados = {};
    
    // Se houver dados no localStorage, converte para objeto
    if (strDados) {
        objDados = JSON.parse(strDados);
    }
    
    let hoje = new Date();
    let vencidos = 0;
    let proximosVencimento = 0;
    let nomeProdutoLower = nomeProduto.toLowerCase();

    // Conta produtos vencidos e próximos ao vencimento
    objDados.produtos.forEach(produto => {
        let dataVencimento = new Date(produto.dataVencimento);
        let diffTime = dataVencimento - hoje;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (produto.nome.toLowerCase() === nomeProdutoLower) {
            if (diffDays < 0) {
                vencidos++;
            } else if (diffDays <= 30) {
                proximosVencimento++;
            }
        }
    });

    // Configuração do gráfico de barras
    var ctxExpiration = document.getElementById('productExpirationChart').getContext('2d');
    var productExpirationChart = new Chart(ctxExpiration, {
        type: 'bar',
        data: {
            labels: ['Produtos Vencidos', 'Produtos Próximos ao Vencimento'],
            datasets: [{
                label: 'Produtos',
                data: [vencidos, proximosVencimento],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    // Configuração do gráfico de pizza
    var ctxExpirationPie = document.getElementById('productExpirationPieChart').getContext('2d');
    var productExpirationPieChart = new Chart(ctxExpirationPie, {
        type: 'pie',
        data: {
            labels: ['Produtos Vencidos', 'Produtos Próximos ao Vencimento'],
            datasets: [{
                data: [vencidos, proximosVencimento],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}