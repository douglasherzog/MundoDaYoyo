const emojis = ['🍎','🍌','🐶','🐱','🚗','🚌','⭐','🌸','🎈','🦋','🐝','🐟','🌳','🏠','⚽','🎨','🍪','🥕','🐘','🐧'];

let atual = null;
let pontos = 0;
let concluido = false;
let usadas = [];

const elementos = {
    par: document.getElementById('par-imagens'),
    pergunta: document.getElementById('pergunta'),
    opcoes: document.getElementById('opcoes'),
    feedback: document.getElementById('feedback'),
    pontos: document.getElementById('pontos'),
    btnSpeak: document.getElementById('btn-speak'),
    btnNext: document.getElementById('btn-next')
};
}

function carregarRodada() {
    const saoIguais = Math.random() > 0.5;
    let emoji1, emoji2;

    if (saoIguais) {
        emoji1 = emojis[Math.floor(Math.random() * emojis.length)];
        emoji2 = emoji1;
    } else {
        const par = embaralhar(emojis).slice(0, 2);
        emoji1 = par[0];
        emoji2 = par[1];
    }

    atual = { emoji1, emoji2, resposta: saoIguais ? 'igual' : 'diferente' };
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.par.innerHTML = `<span>${emoji1}</span><span style="font-size:1.5rem">🟰</span><span>${emoji2}</span>`;
    elementos.pergunta.textContent = 'São iguais ou diferentes?';

    elementos.opcoes.innerHTML = '';
    const opcoes = [
        { texto: '🟢 Iguais', valor: 'igual' },
        { texto: '🔴 Diferentes', valor: 'diferente' }
    ];
    opcoes.forEach(op => {
        const btn = document.createElement('button');
        btn.className = 'animal-button';
        btn.textContent = op.texto;
        btn.dataset.valor = op.valor;
        btn.addEventListener('click', () => selecionar(btn));
        elementos.opcoes.appendChild(btn);
    });

    falar('Olhe os desenhos. São iguais ou diferentes?');
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.valor === atual.resposta) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Isso mesmo! São ${atual.resposta === 'igual' ? 'iguais' : 'diferentes'}!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! São ${atual.resposta === 'igual' ? 'iguais' : 'diferentes'}!`);
    } else {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
}\nelementos.btnSpeak.addEventListener('click', () => falar('Olhe os desenhos. São iguais ou diferentes?'));
elementos.btnNext.addEventListener('click', carregarRodada);

carregarRodada();
