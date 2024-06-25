document.addEventListener('DOMContentLoaded', (event) => {
    // Obtém o ID do produto a partir da URL
    let productId = new URLSearchParams(window.location.search).get('id');
    
    if (productId) {
        let productDetails = getProductDetails(productId);
        
        // Preenche os campos do formulário com os detalhes do produto
        if (productDetails) {
            document.getElementById('productName').value = productDetails.nome;
            document.getElementById('productDescription').value = productDetails.descricao;
            document.getElementById('productPrice').value = formatPriceForInput(productDetails.preco);
            document.getElementById('productQuantity').value = productDetails.quantidade;
            document.getElementById('productEntryDate').value = formatDateForInput(productDetails.dataEntrada);
            document.getElementById('productExpirationDate').value = formatDateForInput(productDetails.dataVencimento);
        }

        // Armazena os valores originais para comparação posterior
        let originalDetails = JSON.stringify({
            nome: document.getElementById('productName').value,
            descricao: document.getElementById('productDescription').value,
            preco: document.getElementById('productPrice').value,
            quantidade: document.getElementById('productQuantity').value,
            dataEntrada: document.getElementById('productEntryDate').value,
            dataVencimento: document.getElementById('productExpirationDate').value
        });

        // Adiciona o funcionalidade ao botão "Salvar"
        document.getElementById('btnSalvarProduto').addEventListener('click', () => {
            if (!document.getElementById('productName').value || !document.getElementById('productDescription').value || 
                !document.getElementById('productPrice').value || !document.getElementById('productQuantity').value || 
                !document.getElementById('productEntryDate').value || !document.getElementById('productExpirationDate').value) {
                showAlert('Todos os campos devem ser preenchidos.', 'danger');
                return;
            }

            let updatedDetails = {
                nome: document.getElementById('productName').value,
                descricao: document.getElementById('productDescription').value,
                preco: parseFloat(document.getElementById('productPrice').value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')).toFixed(2),
                quantidade: parseInt(document.getElementById('productQuantity').value.replace(/\./g, ''), 10),
                dataEntrada: document.getElementById('productEntryDate').value,
                dataVencimento: document.getElementById('productExpirationDate').value
            };

            // Validações de data
            let dataEntradaDate = new Date(updatedDetails.dataEntrada + 'T00:00:00');
            let dataVencimentoDate = new Date(updatedDetails.dataVencimento + 'T00:00:00');
            let hoje = new Date();

            // Ajusta a hora para evitar problemas de fusos horários
            dataEntradaDate.setHours(0, 0, 0, 0);
            dataVencimentoDate.setHours(0, 0, 0, 0);
            hoje.setHours(0, 0, 0, 0);

            // Validação para garantir que a data de vencimento não seja anterior à data de entrada
            if (dataVencimentoDate < dataEntradaDate) {
                showAlert('A data de vencimento não pode ser anterior à data de entrada.', 'danger');
                return;
            }

            // Validação para garantir que a data de entrada e a data de vencimento não sejam a mesma
            if (dataEntradaDate.getTime() === dataVencimentoDate.getTime()) {
                showAlert('A data de entrada e a data de vencimento não podem ser a mesma.', 'danger');
                return;
            }

            // Validação para garantir que a diferença entre a data de entrada e a data de vencimento seja maior que 7 dias
            let diferencaDias = (dataVencimentoDate - dataEntradaDate) / (1000 * 60 * 60 * 24);
            if (diferencaDias < 7) {
                $('#confirmModalDate').modal('show');
                document.getElementById('confirmDate').onclick = function() {
                    salvarProduto(productId, updatedDetails);
                    $('#confirmModalDate').modal('hide');
                };
                return;
            }

            // Validação para garantir que a data de vencimento não seja anterior à data atual
            if (dataVencimentoDate < hoje && diferencaDias >= 7) {
                showAlert('A data de vencimento não pode ser anterior à data atual.', 'danger');
                return;
            }

            let updatedDetailsString = JSON.stringify({
                nome: updatedDetails.nome,
                descricao: updatedDetails.descricao,
                preco: 'R$ ' + updatedDetails.preco.replace('.', ','),
                quantidade: updatedDetails.quantidade.toString(),
                dataEntrada: updatedDetails.dataEntrada,
                dataVencimento: updatedDetails.dataVencimento
            });

            // Verifica se houve alterações nos dados
            if (updatedDetailsString === originalDetails) {
                showAlert('Nenhum dado foi alterado.', 'warning');
                
            } else {
                salvarProduto(productId, updatedDetails);
            }
        });

        document.getElementById('productPrice').addEventListener('input', formatPrice);
        document.getElementById('productQuantity').addEventListener('input', formatQuantity);
    }
});

function showAlert(message, type) {
    let alertContainer = document.getElementById('alertContainer');
    let alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = message;
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Função para obter os detalhes do produto
function getProductDetails(productId) {
    let strDados = localStorage.getItem('db');
    
    // Se houver dados no localStorage, retorna os detalhes do produto
    if (strDados) {
        let objDados = JSON.parse(strDados);
        return objDados.produtos[productId];
    }
    return null;
}

// Função para formatar a data
function formatDateForInput(date) {
    let d = new Date(date + 'T00:00:00');
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
}

// Função para formatar o preço para o input
function formatPriceForInput(price) {
    return 'R$ ' + price.replace('.', ',');
}

// Função para salvar o produto no localStorage
function salvarProduto(productId, updatedDetails) {
    let objDados = leDados();

    let produto = objDados.produtos[parseInt(productId)];

    produto.nome = updatedDetails.nome;
    produto.descricao = updatedDetails.descricao;
    produto.preco = updatedDetails.preco;
    produto.quantidade = updatedDetails.quantidade;
    produto.dataEntrada = updatedDetails.dataEntrada;
    produto.dataVencimento = updatedDetails.dataVencimento;

    salvaDados(objDados);
    showAlert('Produto atualizado com sucesso!', 'success');
    setTimeout(() => {
        window.location.href = 'RelatoriodeProdutos.html';
    }, 2000);
}

// Função para ler os dados do localStorage
function leDados() {
    let strDados = localStorage.getItem('db');
    let objDados = {};

    if (strDados) {
        objDados = JSON.parse(strDados);
    } else {
        objDados = { produtos: [] };
    }

    return objDados;
}

// Função para salvar os dados no localStorage
function salvaDados(dados) {
    localStorage.setItem('db', JSON.stringify(dados));
}

// Função para formatar o preço em reais conforme o usuário digita
function formatPrice(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2) + '';
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    input.value = 'R$ ' + value;
}

// Função para formatar a quantidade conforme o usuário digita
function formatQuantity(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d)(?=(\d{3})+(?!d))/g, '$1.');
    input.value = value;
}