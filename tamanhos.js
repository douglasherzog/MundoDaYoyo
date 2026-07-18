const perguntas = [
    { cena: '                    ', pergunta: 'Qual é o maior?', opcoes: ['elefante', 'ratinho'], correta: 'elefante', explicacao: 'O elefante é muito maior que o ratinho!' },
    { cena: '        ', pergunta: 'Qual é o menor?', opcoes: ['árvore grande', 'muda pequena'], correta: 'muda pequena', explicacao: 'A muda pequena ainda vai crescer!' },
    { cena: '   ', pergunta: 'Qual é o maior?', opcoes: ['casa', 'prédio'], correta: 'prédio', explicacao: 'O prédio é bem maior que a casa!' },
    { cena: '  ', pergunta: 'Qual é o maior?', opcoes: ['melancia', 'uva'], correta: 'melancia', explicacao: 'A melancia é muito maior que a uva!' },
    { cena: '   ', pergunta: 'Qual é o menor?', opcoes: ['leão', 'gatinho'], correta: 'gatinho', explicacao: 'O gatinho é bem menor que o leão!' },
    { cena: ' ', pergunta: 'Qual é a estrela maior?', opcoes: ['estrela pequena', 'estrela grande'], correta: 'estrela grande', explicacao: 'A estrela brilhante é maior!' },
    { cena: '   ', pergunta: 'Qual é o maior?', opcoes: ['carro', 'ônibus'], correta: 'ônibus', explicacao: 'O ônibus é muito maior que o carro!' },
    { cena: '  ', pergunta: 'Qual é o menor?', opcoes: ['flor pequena', 'flor grande'], correta: 'flor pequena', explicacao: 'A florzinha é menor!' },
    { cena: '          ', pergunta: 'Qual é o maior?', opcoes: ['baleia', 'peixinho'], correta: 'baleia', explicacao: 'A baleia é o maior animal do mar!' },
    { cena: '   ', pergunta: 'Qual é o maior?', opcoes: ['lua cheia', 'crescente'], correta: 'lua cheia', explicacao: 'A lua cheia parece maior no céu!' }
];

const elementos = {
    cena: document.getElementById('tamanho-cena'),
    hint: document.getElementById('tamanho-hint'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak')
};

let round = 0;
let ordem = embaralhar(perguntas.map(function(_, i) { return i; }));
let perguntaAtual = null;
let concluido = false;
let pontos = 0;
let wrongCount = 0;

function carregarRodada() {
    if (round >= 10) { vitória(); return; }
    round++;
    var idx = ordem[(round - 1) % ordem.length];
    perguntaAtual = perguntas[idx];
    concluido = false;
    wrongCount = 0;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.cena.textContent = perguntaAtual.cena;
    elementos.hint.textContent = perguntaAtual.pergunta;

    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = (round / 10 * 100) + '%'; bar.textContent = round + ' / 10'; }

    var opcoes = embaralhar(perguntaAtual.opcoes);
    elementos.opcoes.innerHTML = '';
    opcoes.forEach(function(opt) {
        var btn = document.createElement('button');
        btn.className = 'game-option';
        btn.textContent = opt;
        btn.dataset.valor = opt;
        btn.addEventListener('click', function() { selecionar(btn); });
        elementos.opcoes.appendChild(btn);
    });

    setTimeout(function() { falar(perguntaAtual.pergunta); }, 300);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.valor === perguntaAtual.correta) {
        concluido = true;
        pontos += Math.max(10 - wrongCount * 2, 3);
        elementos.pontos.textContent = pontos;
        btn.classList.add('correct');
        elementos.feedback.textContent = ' ' + perguntaAtual.explicacao;
        elementos.feedback.className = 'feedback success';
        playSuccess();
        falar('Muito bem! ' + perguntaAtual.explicacao);
        setTimeout(carregarRodada, 1800);
    } else {
        wrongCount++;
        btn.classList.add('shake', 'disabled');
        btn.disabled = true;
        setTimeout(function() { btn.classList.remove('shake'); }, 500);
        elementos.feedback.textContent = 'Quase! Tenta de novo! ';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
        if (wrongCount === 2) {
            elementos.opcoes.querySelectorAll('.game-option:not(.disabled)').forEach(function(b) {
                if (b.dataset.valor === perguntaAtual.correta) b.classList.add('hint-pulse');
            });
        }
    }
}

function vitória() {
    if (typeof YoyoMascot !== 'undefined') YoyoMascot.celebrate();
    elementos.opcoes.innerHTML = '';
    elementos.feedback.innerHTML = '<div style="font-size:2rem"> Parabéns! Você completou o jogo!</div>';
    elementos.feedback.className = 'feedback success';
    elementos.cena.textContent = '';
    var bar = document.getElementById('progress-bar');
    if (bar) { bar.style.width = '100%'; bar.textContent = '10 / 10 '; }
    if (typeof adicionarEstrelas === 'function') adicionarEstrelas(3);
    falar('Parabéns! Você completou o jogo!');
    var btn = document.createElement('button');
    btn.className = 'game-option play-again-btn';
    btn.textContent = ' Brincar de novo!';
    btn.addEventListener('click', function() { round = 0; pontos = 0; elementos.pontos.textContent = 0; ordem = embaralhar(perguntas.map(function(_, i) { return i; })); carregarRodada(); });
    elementos.opcoes.appendChild(btn);
}

elementos.btnSpeak.addEventListener('click', function() {
    if (perguntaAtual) falar(perguntaAtual.pergunta);
});

carregarRodada();