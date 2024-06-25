document.addEventListener('DOMContentLoaded', (event) => {
    let produtos = leDados().produtos;
    imprimeDados(produtos);
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

// Função para imprimir os dados dos produtos na tabela
function imprimeDados(produtos) {
    let hoje = new Date();
    let productList = document.getElementById('productList');
    let strHtml = '<table class="table table-striped">';
    strHtml += '<thead class="thead-dark"><tr><th>Código</th><th>Nome</th><th>Descrição</th><th>Preço</th><th>Quantidade</th><th>Data de Entrada</th><th>Data de Vencimento</th><th>Ações</th></tr></thead><tbody>';

    // Ordena produtos por prioridade
    produtos.sort((a, b) => {
        let dataVencA = new Date(a.dataVencimento);
        let dataVencB = new Date(b.dataVencimento);
        return dataVencA - dataVencB;
    });

    for (let i = 0; i < produtos.length; i++) {
        let dataVencimento = new Date(produtos[i].dataVencimento);
        let diffTime = dataVencimento - hoje;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let rowClass = '';

        if (diffDays < 0) {
            rowClass = 'table-danger';
        } else if (diffDays <= 30) {
            rowClass = 'table-warning';
        }

        strHtml += `<tr class="${rowClass}" id="produto-${i}">
                        <td>${produtos[i].codigo}</td>
                        <td>${produtos[i].nome}</td>
                        <td>${produtos[i].descricao}</td>
                        <td>R$${produtos[i].preco}</td>
                        <td>${produtos[i].quantidade}</td>
                        <td>${produtos[i].dataEntrada}</td>
                        <td>${produtos[i].dataVencimento}</td>
                        <td>
                            <div class="btn-group">
                                <button onclick="confirmarExclusao(${i})" class="btn btn-danger">Excluir</button>
                                <button onclick="confirmarVisto(${i})" class="btn btn-success">Visto</button>
                            </div>
                        </td>
                    </tr>`;
    }

    strHtml += '</tbody></table>';
    productList.innerHTML = strHtml;
}

// Função para redirecionar para a página de edição com o ID do produto
function editarProduto(index) {
    window.location.href = '/public/Lembretes/Relatoriosedit/EditarProdutos.html';
}

// Função para confirmar a exclusão de um produto
function confirmarExclusao(index) {
    if (confirm("Você realmente quer excluir este produto?")) {
        excluirProduto(index);
    }
}

// Função para excluir um produto do localStorage
function excluirProduto(index) {
    let objDados = leDados();
    objDados.produtos.splice(index, 1);
    salvaDados(objDados);
    imprimeDados(objDados.produtos);
}

// Função para confirmar que o usuário viu o produto e removê-lo da lista
function confirmarVisto(index) {
    if (confirm("Você realmente quer marcar este produto como visto?")) {
        let objDados = leDados();
        objDados.produtos.splice(index, 1);
        salvaDados(objDados);
        location.reload();
    }
}

// Função para verificar produtos vencidos ou próximos ao vencimento
function verificaVencimentos(produtos) {
    let hoje = new Date();
    let produtosVencidos = [];
    let produtosProximosVencimento = [];

    produtos.forEach(produto => {
        let dataVencimento = new Date(produto.dataVencimento);
        let diffTime = dataVencimento - hoje;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            produtosVencidos.push(produto.nome);
        } else if (diffDays <= 30) {
            produtosProximosVencimento.push(produto.nome);
        }
    });

    if (produtosVencidos.length > 0) {
        alert("Atenção! Os seguintes produtos estão vencidos: " + produtosVencidos.join(", "));
    }

    if (produtosProximosVencimento.length > 0) {
        alert("Atenção! Os seguintes produtos estão próximos ao vencimento: " + produtosProximosVencimento.join(", "));
    }
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
