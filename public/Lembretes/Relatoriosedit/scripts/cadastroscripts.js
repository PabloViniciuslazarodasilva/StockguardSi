document.addEventListener('DOMContentLoaded', () => {
     // Verifique se os dados já estão armazenados no localStorage
     if (!localStorage.getItem('db')) {
        const db = {
            produtos: [
                {
                    codigo: '01',
                    nome: 'Produto A',
                    descricao: 'Descrição do Produto A',
                    preco: '10.00',
                    quantidade: 5,
                    dataEntrada: '2024-01-01',
                    dataVencimento: '2024-12-31'
                },
                {
                    codigo: '02',
                    nome: 'Produto B',
                    descricao: 'Descrição do Produto B',
                    preco: '20.00',
                    quantidade: 10,
                    dataEntrada: '2024-02-01',
                    dataVencimento: '2025-01-31'
                }
            ]
        };
        localStorage.setItem('db', JSON.stringify(db));
    }

    // Configura os botões
    document.getElementById('btnIncluirProduto').addEventListener('click', incluirProduto);
    document.getElementById('btnCancelar').addEventListener('click', cancelarCadastro);
    document.getElementById('productPrice').addEventListener('input', formatPrice);
    document.getElementById('productQuantity').addEventListener('input', formatQuantity);
});

// Função para ler dados do localStorage
function leDados() {
    let strDados = localStorage.getItem('db');
    let objDados = {};
    // Verifica se há dados no localStorage
    if (strDados) {
        objDados = JSON.parse(strDados);
    } else {
        objDados = { 
            produtos: []
        };
    }

    return objDados;
}

// Função para salvar dados no localStorage
function salvaDados(dados) {
    localStorage.setItem('db', JSON.stringify(dados));
}

// Função para cancelar o cadastro e redirecionar para a página de relatório
function cancelarCadastro() {
    window.location.href = 'RelatoriodeProdutos.html';
}

// Função para gerar código sequencial
function gerarCodigoProduto() {
    let objDados = leDados();
    let produtos = objDados.produtos;

    if (produtos.length === 0) {
        return '01';
    }

    let ultimoCodigo = parseInt(produtos[produtos.length - 1].codigo, 10);
    if (isNaN(ultimoCodigo)) {
        return '01';
    }

    let novoCodigo = (ultimoCodigo + 1).toString().padStart(2, '0');
    return novoCodigo;
}

// Função para incluir um novo produto
function incluirProduto() {
    let objDados = leDados();

    let codigo = gerarCodigoProduto();
    let nome = document.getElementById('productName').value;
    let descricao = document.getElementById('productDescription').value;
    let preco = parseFloat(document.getElementById('productPrice').value.replace('R$', '').replace(/\./g, '').replace(',', '.')).toFixed(2);
    let quantidade = parseInt(document.getElementById('productQuantity').value.replace(/\./g, ''), 10);
    let dataEntrada = document.getElementById('productEntryDate').value;
    let dataVencimento = document.getElementById('productExpirationDate').value;

    // Validações
    if (!nome || !descricao || !preco || !quantidade || !dataEntrada || !dataVencimento) {
        showAlert('Por favor, preencha todos os campos.', 'danger');
        return;
    }

    if (preco <= 0) {
        showAlert('O preço deve ser um número positivo.', 'danger');
        return;
    }

    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        showAlert('A quantidade deve ser um número inteiro positivo.', 'danger');
        return;
    }

    let dataEntradaDate = new Date(dataEntrada + 'T00:00:00');
    let dataVencimentoDate = new Date(dataVencimento + 'T00:00:00');
    let hoje = new Date();

    dataEntradaDate.setHours(0, 0, 0, 0);
    dataVencimentoDate.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    // Validação para garantir que a data de vencimento não seja anterior à data atual
    if (dataVencimentoDate < hoje) {
        showAlert('A data de vencimento não pode ser anterior à data atual.', 'danger');
        return;
    }

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
        showAlert('A diferença entre a data de entrada e a data de vencimento deve ser de pelo menos 7 dias.', 'danger');
        return;
    }

    // Cria um novo produto com os dados fornecidos
    let novoProduto = {
        codigo: codigo,
        nome: nome,
        descricao: descricao,
        preco: preco,
        quantidade: quantidade,
        dataEntrada: dataEntrada,
        dataVencimento: dataVencimento
    };

    // Adiciona o novo produto ao objeto de dados
    objDados.produtos.push(novoProduto);

    // Salva os dados no localStorage novamente
    salvaDados(objDados);

    // Alerta de sucesso e exibe o modal para confirmação de cadastro de novo produto
    showAlert('Produto cadastrado com sucesso!', 'success');
    $('#confirmModalCadastro').modal('show');
}

// Adicionar a funcionalidade de confirmação
document.getElementById('confirmCadastro').addEventListener('click', function() {
    document.getElementById('productForm').reset();
    $('#confirmModalCadastro').modal('hide');
});

document.querySelector('#confirmModalCadastro .btn-secondary').addEventListener('click', function() {
    window.location.href = 'RelatoriodeProdutos.html';
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