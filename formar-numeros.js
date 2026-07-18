const digitos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const nomesNumeros = {
    0: 'zero', 1: 'um', 2: 'dois', 3: 'três', 4: 'quatro',
    5: 'cinco', 6: 'seis', 7: 'sete', 8: 'oito', 9: 'nove',
    10: 'dez', 11: 'onze', 12: 'doze', 13: 'treze', 14: 'quatorze',
    15: 'quinze', 16: 'dezesseis', 17: 'dezessete', 18: 'dezoito', 19: 'dezenove',
    20: 'vinte', 30: 'trinta', 40: 'quarenta', 50: 'cinquenta',
    60: 'sessenta', 70: 'setenta', 80: 'oitenta', 90: 'noventa',
    100: 'cem'
};

let numeroAtual = '';

const elementos = {
    display: document.getElementById('number-display'),
    words: document.getElementById('number-words'),
    keyboard: document.getElementById('digit-keyboard'),
    feedback: document.getElementById('feedback'),
    btnSpeak: document.getElementById('btn-speak'),
    btnClear: document.getElementById('btn-clear'),
    btnNext: document.getElementById('btn-next')
};

}

function numeroPorExtenso(numero) {
    const n = parseInt(numero, 10);

    if (isNaN(n)) return '';
    if (nomesNumeros[n]) return nomesNumeros[n];

    if (n < 100) {
        const dezena = Math.floor(n / 10) * 10;
        const unidade = n % 10;
        if (unidade === 0) return nomesNumeros[dezena];
        return nomesNumeros[dezena] + ' e ' + nomesNumeros[unidade];
    }

    if (n < 1000) {
        const centena = Math.floor(n / 100);
        const resto = n % 100;
        let texto = centena === 1 && resto === 0 ? 'cem' : nomesNumeros[centena] + ' centos';
        if (resto > 0) {
            texto += ' e ' + numeroPorExtenso(resto.toString());
        }
        return texto;
    }

    return n.toString();
}

function atualizarTela() {
    const numero = numeroAtual || '0';
    elementos.display.textContent = numero;
    elementos.words.textContent = numeroPorExtenso(numero);
}

function adicionarDigito(digito) {
    if (numeroAtual.length < 4) {
        numeroAtual += digito;
        atualizarTela();
        falar(digito);
    }
}

function limpar() {
    numeroAtual = '';
    atualizarTela();
    elementos.feedback.textContent = '';
    elementos.feedback.className = 'feedback';
}

function numeroSurpresa() {
    const tamanho = Math.floor(Math.random() * 2) + 2;
    let numero = '';
    for (let i = 0; i < tamanho; i++) {
        numero += Math.floor(Math.random() * 10);
    }
    numeroAtual = numero.replace(/^0+/, '') || '0';
    atualizarTela();
    playSuccess();
    falar(numeroPorExtenso(numeroAtual));
    elementos.feedback.textContent = '✨ Que número lindo!';
    elementos.feedback.className = 'feedback success';
}

function criarTeclado() {
    digitos.forEach((digito, indice) => {
        const botao = document.createElement('button');
        botao.className = `syllable color-${(indice % 6) + 1}`;
        botao.textContent = digito;
        botao.addEventListener('click', () => adicionarDigito(digito));
        elementos.keyboard.appendChild(botao);
    });
}

elementos.btnSpeak.addEventListener('click', () => {
    if (numeroAtual) {
        falar(numeroPorExtenso(numeroAtual));
    } else {
        falar('zero');
    }
});

elementos.btnClear.addEventListener('click', limpar);
elementos.btnNext.addEventListener('click', numeroSurpresa);

criarTeclado();
atualizarTela();
