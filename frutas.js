const itens = [
    { nome: 'maçã', emoji: '🍎', dica: 'É vermelha e crocante' },
    { nome: 'banana', emoji: '🍌', dica: 'É amarela e curva' },
    { nome: 'uva', emoji: '🍇', dica: 'São bolinhas roxas' },
    { nome: 'morango', emoji: '🍓', dica: 'É vermelha e tem pontinhos' },
    { nome: 'laranja', emoji: '🍊', dica: 'É redonda e laranja' },
    { nome: 'melancia', emoji: '🍉', dica: 'É verde por fora e vermelha por dentro' },
    { nome: 'abacaxi', emoji: '🍍', dica: 'Tem espinhos e é amarelo por dentro' },
    { nome: 'pera', emoji: '🍐', dica: 'É verde e doce' },
    { nome: 'cereja', emoji: '🍒', dica: 'São duas bolinhas vermelhas' },
    { nome: 'limão', emoji: '🍋', dica: 'É amarelo e azedo' },
    { nome: 'cenoura', emoji: '🥕', dica: 'É laranja e os coelhos adoram' },
    { nome: 'brócolis', emoji: '🥦', dica: 'É verde e parece uma arvorezinha' },
    { nome: 'milho', emoji: '🌽', dica: 'É amarelo e tem graõzinhos' },
    { nome: 'tomate', emoji: '🍅', dica: 'É redondo e vermelho' },
    { nome: 'batata', emoji: '🥔', dica: 'É marrom e usamos para fazer batata frita' },
];

let atual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    emoji: document.getElementById('fruta-emoji'),
    hint: document.getElementById('fruta-hint'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};
}

function carregarRodada() {
    atual = itens[Math.floor(Math.random() * itens.length)];
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.emoji.textContent = atual.emoji;
    elementos.emoji.classList.remove('celebration');
    elementos.hint.textContent = 'O que é isso?';

    const opcoes = [atual];
    const pool = itens.filter(i => i !== atual);
    const embaralhado = embaralhar(pool);
    while (opcoes.length < 4) opcoes.push(embaralhado[opcoes.length - 1]);

    elementos.opcoes.innerHTML = '';
    embaralhar(opcoes).forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'animal-button';
        btn.textContent = item.nome;
        btn.dataset.nome = item.nome;
        btn.addEventListener('click', () => selecionar(btn));
        elementos.opcoes.appendChild(btn);
    });

    falar(`O que é isso? ${atual.dica}`);
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.nome === atual.nome) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.emoji.textContent = `${atual.emoji}`;
        elementos.emoji.classList.add('celebration');
        elementos.feedback.textContent = `🎉 Isso mesmo! É ${atual.nome}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! É ${atual.nome}. ${atual.dica}!`);
    } else {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
}\nelementos.btnSpeak.addEventListener('click', () => falar(`O que é isso? ${atual.dica}`));
elementos.btnNext.addEventListener('click', carregarRodada);

carregarRodada();
