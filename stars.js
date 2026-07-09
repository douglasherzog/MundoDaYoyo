const CHAVE_ESTRELAS = 'mundodayoyo_estrelas';

function carregarEstrelas() {
    try {
        const salvo = localStorage.getItem(CHAVE_ESTRELAS);
        return salvo ? parseInt(salvo, 10) : 0;
    } catch (e) {
        return 0;
    }
}

function salvarEstrelas(quantidade) {
    try {
        localStorage.setItem(CHAVE_ESTRELAS, quantidade.toString());
    } catch (e) {
        // Ignora erros de armazenamento
    }
}

let estrelasAtuais = carregarEstrelas();

function obterEstrelas() {
    return estrelasAtuais;
}

function adicionarEstrelas(quantidade = 1) {
    estrelasAtuais += quantidade;
    salvarEstrelas(estrelasAtuais);
    atualizarContador();
    animarEstrela(quantidade);
}

function criarContador() {
    let contador = document.getElementById('star-counter');
    if (!contador) {
        contador = document.createElement('div');
        contador.id = 'star-counter';
        contador.className = 'star-counter';
        contador.title = 'Estrelas da Yoyo';

        const header = document.querySelector('header');
        if (header) {
            header.appendChild(contador);
        } else {
            document.body.insertBefore(contador, document.body.firstChild);
        }
    }
    return contador;
}

function atualizarContador() {
    const contador = criarContador();
    contador.textContent = `⭐ ${estrelasAtuais}`;
}

function animarEstrela(quantidade) {
    for (let i = 0; i < quantidade; i++) {
        setTimeout(() => {
            const estrela = document.createElement('div');
            estrela.className = 'star-float';
            estrela.textContent = '⭐';
            estrela.style.left = `${50 + (Math.random() * 20 - 10)}%`;
            estrela.style.bottom = '100px';
            document.body.appendChild(estrela);

            setTimeout(() => {
                estrela.remove();
            }, 1500);
        }, i * 300);
    }
}

function inicializarEstrelas() {
    atualizarContador();
}

inicializarEstrelas();
