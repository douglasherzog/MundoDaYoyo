const perguntas = [
    {
        cena: '🐘                    🐭',
        pergunta: 'Qual é o maior?',
        opcoes: ['elefante', 'ratinho'],
        correta: 'elefante',
        explicacao: 'O elefante é muito maior que o ratinho!'
    },
    {
        cena: '🌳        🌱',
        pergunta: 'Qual é o menor?',
        opcoes: ['árvore grande', 'muda pequena'],
        correta: 'muda pequena',
        explicacao: 'A muda pequena ainda vai crescer!'
    },
    {
        cena: '🏠   🏢',
        pergunta: 'Qual é o maior?',
        opcoes: ['casa', 'prédio'],
        correta: 'prédio',
        explicacao: 'O prédio é bem maior que a casa!'
    },
    {
        cena: '🍉  🍇',
        pergunta: 'Qual é o maior?',
        opcoes: ['melancia', 'uva'],
        correta: 'melancia',
        explicacao: 'A melancia é muito maior que a uva!'
    },
    {
        cena: '🦁   🐱',
        pergunta: 'Qual é o menor?',
        opcoes: ['leão', 'gatinho'],
        correta: 'gatinho',
        explicacao: 'O gatinho é bem menor que o leão!'
    },
    {
        cena: '⭐ 🌟',
        pergunta: 'Qual é a estrela maior?',
        opcoes: ['estrela pequena', 'estrela grande'],
        correta: 'estrela grande',
        explicacao: 'A estrela brilhante é maior!'
    },
    {
        cena: '🚗   🚌',
        pergunta: 'Qual é o maior?',
        opcoes: ['carro', 'ônibus'],
        correta: 'ônibus',
        explicacao: 'O ônibus é muito maior que o carro!'
    },
    {
        cena: '🌸  🌺',
        pergunta: 'Qual é o menor?',
        opcoes: ['flor pequena', 'flor grande'],
        correta: 'flor pequena',
        explicacao: 'A florzinha é menor!'
    },
    {
        cena: '🐋          🐟',
        pergunta: 'Qual é o maior?',
        opcoes: ['baleia', 'peixinho'],
        correta: 'baleia',
        explicacao: 'A baleia é o maior animal do mar!'
    },
    {
        cena: '🌕   🌙',
        pergunta: 'Qual é o maior?',
        opcoes: ['lua cheia', 'crescente'],
        correta: 'lua cheia',
        explicacao: 'A lua cheia parece maior no céu!'
    },
];

let atual = null;
let pontos = 0;
let concluido = false;
let usadas = [];

const elementos = {
    cena: document.getElementById('tamanho-cena'),
    hint: document.getElementById('tamanho-hint'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};

    return novo;
}

}

function carregarRodada() {
    if (usadas.length === perguntas.length) usadas = [];
    const disponiveis = perguntas.filter((_, i) => !usadas.includes(i));
    const idx = perguntas.indexOf(disponiveis[Math.floor(Math.random() * disponiveis.length)]);
    usadas.push(idx);
    atual = perguntas[idx];
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.cena.style.fontSize = '3rem';
    elementos.cena.textContent = atual.cena;
    elementos.hint.textContent = atual.pergunta;

    elementos.opcoes.innerHTML = '';
    embaralhar(atual.opcoes).forEach(opcao => {
        const btn = document.createElement('button');
        btn.className = 'animal-button';
        btn.textContent = opcao;
        btn.dataset.valor = opcao;
        btn.addEventListener('click', () => selecionar(btn));
        elementos.opcoes.appendChild(btn);
    });

    falar(atual.pergunta);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.valor === atual.correta) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Isso mesmo! ${atual.explicacao}`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! ${atual.explicacao}`);
    } else {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
    }
}

elementos.btnSpeak.addEventListener('click', () => falar(atual.pergunta));
elementos.btnNext.addEventListener('click', carregarRodada);

carregarRodada();
