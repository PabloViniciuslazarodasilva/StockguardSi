document.addEventListener('DOMContentLoaded', (event) => {
    // Lê os produtos do localStorage e imprime os dados na tabela
    let produtos = leDados().produtos;
    imprimeDados(produtos);
    // Verifica e alerta sobre produtos vencidos ou próximos ao vencimento
    verificaVencimentos(produtos);
    
    // Configura o campo de pesquisa e o ícone de lupa
    document.getElementById('searchInput').addEventListener('input', function() {
        filtraDados(this.value);
    });
    document.getElementById('searchIcon').addEventListener('click', function() {
        let filtro = document.getElementById('searchInput').value;
        filtraDados(filtro);
    });
});

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

function imprimeDados(produtos) {
    let hoje = new Date();
    let productList = document.getElementById('productList');
    let strHtml = '<table class="table table-striped">';
    strHtml += '<thead class="thead-dark"><tr><th>Código</th><th>Nome</th><th>Descrição</th><th>Preço</th><th>Quantidade</th><th>Data de Entrada</th><th>Data de Vencimento</th><th>Ações</th></tr></thead><tbody>';

    for (let i = 0; i < produtos.length; i++) {
        let dataVencimento = new Date(produtos[i].dataVencimento + 'T00:00:00');
        let dataEntrada = new Date(produtos[i].dataEntrada + 'T00:00:00');
        let diffTime = dataVencimento - hoje;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let rowClass = '';

        if (diffDays < 0) {
            rowClass = 'table-danger';
        } else if (diffDays <= 30) {
            rowClass = 'table-warning';
        }

        let formattedDataEntrada = `${('0' + dataEntrada.getDate()).slice(-2)}/${('0' + (dataEntrada.getMonth() + 1)).slice(-2)}/${dataEntrada.getFullYear()}`;
        let formattedDataVencimento = `${('0' + dataVencimento.getDate()).slice(-2)}/${('0' + (dataVencimento.getMonth() + 1)).slice(-2)}/${dataVencimento.getFullYear()}`;

        strHtml += `<tr class="${rowClass}">
                        <td>${produtos[i].codigo}</td>
                        <td>${produtos[i].nome}</td>
                        <td>${produtos[i].descricao}</td>
                        <td>R$${produtos[i].preco}</td>
                        <td>${produtos[i].quantidade}</td>
                        <td>${formattedDataEntrada}</td>
                        <td>${formattedDataVencimento}</td>
                        <td>
                            <div class="btn-group">
                                <a href="DetalhesProduto.html?id=${i}" class="btn btn-info">Ver Detalhes</a>
                                <button class="btn btn-warning" onclick="editarProduto(${i})">Editar</button>
                                <button class="btn btn-danger" onclick="confirmarExclusao(${i})">Excluir</button>
                            </div>
                        </td>
                    </tr>`;
    }

    strHtml += '</tbody></table>';
    productList.innerHTML = strHtml;
}

// Função para redirecionar para a página de edição com o ID do produto
function editarProduto(index) {
    window.location.href = `EditarProdutos.html?id=${index}`; 
}

// Função para confirmar a exclusão de um produto
function confirmarExclusao(index) {
    $('#confirmModal').modal('show');
    document.getElementById('confirmDelete').onclick = function() {
        excluirProduto(index);
        $('#confirmModal').modal('hide');
    };
}

// Função para excluir um produto do localStorage
function excluirProduto(index) {
    let objDados = leDados();
    objDados.produtos.splice(index, 1); 
    salvaDados(objDados); 
    imprimeDados(objDados.produtos); 
}

// Função para verificar produtos vencidos ou próximos ao vencimento
function verificaVencimentos(produtos) {
    let hoje = new Date();
    let produtosVencidos = [];
    let produtosProximosVencimento = [];

    produtos.forEach(produto => {
        let dataVencimento = new Date(produto.dataVencimento + 'T00:00:00');
        let diffTime = dataVencimento - hoje;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            produtosVencidos.push(produto.nome); 
        } else if (diffDays <= 30) {
            produtosProximosVencimento.push(produto.nome); 
        }
    });

    let alertContainer = document.getElementById('alertContainer');
     // Limpa os alertas anteriores
    alertContainer.innerHTML = '';

    if (produtosVencidos.length > 0) {
        let alertaVencidos = document.createElement('div');
        alertaVencidos.className = 'alert alert-danger';
        alertaVencidos.role = 'alert';
        alertaVencidos.textContent = "Atenção! Os seguintes produtos estão vencidos: " + produtosVencidos.join(", ");
        alertContainer.appendChild(alertaVencidos);
    }

    if (produtosProximosVencimento.length > 0) {
        let alertaProximos = document.createElement('div');
        alertaProximos.className = 'alert alert-warning';
        alertaProximos.role = 'alert';
        alertaProximos.textContent = "Atenção! Os seguintes produtos estão próximos ao vencimento: " + produtosProximosVencimento.join(", ");
        alertContainer.appendChild(alertaProximos);
    }

    // Oculta os alertas após 5 segundos
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Função para filtrar os dados de acordo com o input de pesquisa
function filtraDados(filtro) {
    let produtos = leDados().produtos;
    filtro = filtro.toLowerCase();

    let produtosFiltrados = produtos.filter(produto => {
        return produto.codigo.toLowerCase().includes(filtro) ||
               produto.nome.toLowerCase().includes(filtro) ||
               produto.dataVencimento.toLowerCase().includes(filtro);
    });
// Limpa a tabela antes de imprimir os dados filtrados
    document.getElementById('productList').innerHTML = ''; 
    // Imprime apenas os produtos filtrados
    imprimeDados(produtosFiltrados); 
}