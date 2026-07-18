const grupos = [
    { categoria: 'fruta',     itens: ['🍎','🍌','🍇','🍓','🍊','🍐','🍉','🍍'], intrusos: ['🐶','🐱','🚗','⭐'] },
    { categoria: 'animal',    itens: ['🐶','🐱','🐰','🐦','🐟','🐘','🦁','🐧'], intrusos: ['🍎','🚗','🏠','⚽'] },
    { categoria: 'brinquedo', itens: ['⚽','🎈','🧩','🎨','🪁','🧸','🚂','🪀'], intrusos: ['🐶','🍎','🌳','🏠'] },
    { categoria: 'transporte',itens: ['🚗','🚌','✈️','🚲','🚂','🚢','🏍️','🚁'], intrusos: ['🐶','🍎','🌸','⭐'] },
    { categoria: 'natureza',  itens: ['🌳','🌸','⭐','🌞','🌈','🏔️','🌊','🍀'], intrusos: ['🐶','🚗','🍪','⚽'] },
    { categoria: 'comida',    itens: ['🍪','🍕','🍞','🥕','🌽','🥛','🍎','🍌'], intrusos: ['🐶','🚗','⭐','🎈'] },
    { categoria: 'roupa',     itens: ['👕','👖','👗','👟','🧢','🧦','🧥','🧣'], intrusos: ['🐶','🍎','🚗','⚽'] },
    { categoria: 'cor',       itens: ['🔴','🟢','🔵','🟡','🟠','🟣','⚫','⚪'], intrusos: ['🐶','🍎','🚗','⭐'] },
];

let atual = null;
let pontos = 0;
let concluido = false;

const elementos = {
    dica: document.getElementById('dica'),
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
    const grupo = grupos[Math.floor(Math.random() * grupos.length)];
    const tresIguais = embaralhar(grupo.itens).slice(0, 3);
    const intruso = grupo.intrusos[Math.floor(Math.random() * grupo.intrusos.length)];

    atual = { grupo: grupo.categoria, intruso, corretos: tresIguais };
    concluido = false;

    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
    elementos.btnNext.disabled = true;
    elementos.dica.textContent = 'Qual não encaixa?';

    const todos = embaralhar([...tresIguais, intruso]);
    elementos.opcoes.innerHTML = '';
    todos.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'animal-button';
        btn.style.fontSize = '3rem';
        btn.textContent = emoji;
        btn.dataset.valor = emoji;
        btn.addEventListener('click', () => selecionar(btn));
        elementos.opcoes.appendChild(btn);
    });

    falar('Qual não encaixa com os outros?');
}

function selecionar(btn) {
    if (concluido) return;
    if (btn.dataset.valor === atual.intruso) {
        concluido = true;
        pontos += 10;
        elementos.pontos.textContent = pontos;
        elementos.feedback.textContent = `🎉 Isso! O ${atual.intruso} não encaixa!`;
        elementos.feedback.className = 'feedback success';
        elementos.btnNext.disabled = false;
        playSuccess();
        falar(`Muito bem! O ${atual.intruso} não encaixa com os outros!`);
    } else {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 500);
        elementos.feedback.textContent = 'Tente de novo! 💪';
        elementos.feedback.className = 'feedback error';
        playError();
        falar('Tente de novo');
    }
}

elementos.btnSpeak.addEventListener('click', () => falar('Qual não encaixa com os outros?'));
elementos.btnNext.addEventListener('click', carregarRodada);

carregarRodada();
