const animais = [
    { nome: 'cachorro', emoji: '🐶', som: 'au au', dica: 'Faz au au' },
    { nome: 'gato', emoji: '🐱', som: 'miau', dica: 'Faz miau' },
    { nome: 'passarinho', emoji: '🐦', som: 'piu piu', dica: 'Faz piu piu' },
    { nome: 'vaca', emoji: '🐮', som: 'muuu', dica: 'Faz muuu' },
    { nome: 'leão', emoji: '🦁', som: 'roar', dica: 'Ruge forte' },
    { nome: 'peixe', emoji: '🐟', som: 'glub glub', dica: 'Faz glub glub' },
    { nome: 'coelho', emoji: '🐰', som: 'snif', dica: 'Pula muito' },
    { nome: 'elefante', emoji: '🐘', som: 'fuuu', dica: 'Tem tromba grande' },
    { nome: 'pato', emoji: '🦆', som: 'quack', dica: 'Faz quack' },
    { nome: 'cavalo', emoji: '🐴', som: 'relinchar', dica: 'Relincha' }
];

let animalAtual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    word: document.getElementById('animal-word'),
    hint: document.getElementById('animal-hint'),
    animals: document.getElementById('animals'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};

function embaralhar(array) {
    const novo = [...array];
    for (let i = novo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novo[i], novo[j]] = [novo[j], novo[i]];
    }
    return novo;
}

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

function escolherAnimal() {
    return animais[Math.floor(Math.random() * animais.length)];
}

function carregarRodada() {
    animalAtual = escolherAnimal();
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;

    elementos.word.textContent = animalAtual.emoji;
    elementos.word.classList.remove('celebration');
    elementos.hint.textContent = 'Qual é esse animal?';

    const opcoes = [animalAtual];
    while (opcoes.length < 4) {
        const candidato = escolherAnimal();
        if (!opcoes.includes(candidato)) {
            opcoes.push(candidato);
        }
    }

    const opcoesEmbaralhadas = embaralhar(opcoes);
    elementos.animals.innerHTML = '';
    opcoesEmbaralhadas.forEach((animal) => {
        const botao = document.createElement('button');
        botao.className = 'animal-button';
        botao.textContent = animal.nome;
        botao.dataset.nome = animal.nome;
        botao.title = animal.nome;
        botao.addEventListener('click', () => selecionarAnimal(botao));
        elementos.animals.appendChild(botao);
    });

    falar(`Qual animal faz ${animalAtual.som}?`);
}

function selecionarAnimal(botao) {
    if (concluido) return;

    const nomeEscolhido = botao.dataset.nome;

    if (nomeEscolhido === animalAtual.nome) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.word.textContent = `${animalAtual.emoji} ${animalAtual.nome}`;
        elementos.feedback.textContent = `🎉 Acertou! É o ${animalAtual.nome}!`;
        elementos.feedback.className = 'feedback success';
        elementos.word.classList.add('celebration');
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! É o ${animalAtual.nome}. ${animalAtual.som}!`);
    } else {
        botao.classList.add('shake');
        setTimeout(() => botao.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente outro animal! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente outro animal');
    }
}

elementos.btnSpeak.addEventListener('click', () => {
    falar(`Qual animal faz ${animalAtual.som}?`);
});

elementos.btnNext.addEventListener('click', () => {
    carregarRodada();
});

carregarRodada();
