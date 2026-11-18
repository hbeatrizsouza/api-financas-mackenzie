
const API_URL = '/transacoes';

const form = document.getElementById('formTransacao');

// Formata valores para moeda brasileira
function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Busca os dados do back-end
async function carregarDashboard() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Não foi possível buscar as transações.');
        }

        const dados = await resposta.json();

        // Exibe as métricas calculadas pela API
        document.getElementById('saldoTotal').textContent =
            formatarMoeda(dados.metricas.saldoTotal);

        document.getElementById('totalDespesas').textContent =
            formatarMoeda(dados.metricas.totalDespesas);

        document.getElementById('totalGastoImpulso').textContent =
            formatarMoeda(dados.metricas.totalGastoImpulso);

        // Exibe o histórico
        mostrarHistorico(dados.historico);

    } catch (erro) {
        console.error(erro);

        document.getElementById('listaTransacoes').textContent =
            'Não foi possível carregar o histórico.';
    }
}

// Mostra as transações na tela
function mostrarHistorico(transacoes) {
    const lista = document.getElementById('listaTransacoes');

    lista.innerHTML = '';

    if (!transacoes || transacoes.length === 0) {
        lista.textContent = 'Nenhuma transação cadastrada.';
        return;
    }

    transacoes.forEach((transacao) => {
        const item = document.createElement('div');
        item.classList.add('transacao');

        const descricao = document.createElement('strong');
        descricao.textContent = transacao.descricao;

        const detalhes = document.createElement('p');
        detalhes.textContent =
            `${transacao.categoria} | ${transacao.tipo}`;

        const valor = document.createElement('p');
        valor.textContent = formatarMoeda(transacao.valor);

        const consumo = document.createElement('p');
        consumo.textContent = transacao.tipo === 'despesa'
            ? (transacao.consumoConsciente
                ? 'Gasto consciente'
                : 'Gasto por impulso')
            : 'Receita';

        item.append(descricao, detalhes, valor, consumo);
        lista.appendChild(item);
    });
}

// Cadastra uma nova transação
form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const dadosTransacao = {
        descricao: document.getElementById('descricao').value,
        valor: Number(document.getElementById('valor').value),
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value,
        consumoConsciente:
            document.getElementById('consumoConsciente').checked
    };

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosTransacao)
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.message || 'Erro ao cadastrar transação.');
        }

        alert('Transação cadastrada com sucesso!');

        form.reset();

        // Atualiza o dashboard e o histórico
        await carregarDashboard();

    } catch (erro) {
        console.error(erro);
        alert(erro.message || 'Não foi possível cadastrar a transação.');
    }
});

// Carrega os dados ao abrir a página
carregarDashboard();
