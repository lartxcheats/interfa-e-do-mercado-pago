// Saldo editável
const balanceAmount = document.querySelector('.balance-amount');
const eyeBtn = document.querySelector('.eye-btn');
const currency = document.querySelector('.currency');
let isHidden = false;
let savedValue = '0';

// Função para ajustar tamanho do texto baseado no comprimento
function adjustFontSize() {
    const balanceValue = document.querySelector('.value');
    const currency = document.querySelector('.currency');
    const eyeBtn = document.querySelector('.eye-btn');
    
    if (!balanceValue) return;
    
    const textLength = balanceValue.textContent.length;
    
    // Ajusta tamanho baseado no comprimento
    if (textLength <= 4) {
        // Valores pequenos: 0, 1,00, etc
        currency.style.fontSize = '38px';
        balanceValue.style.fontSize = '42px';
        eyeBtn.querySelector('svg').style.width = '28px';
        eyeBtn.querySelector('svg').style.height = '28px';
    } else if (textLength <= 8) {
        // Valores médios: 1.000,00
        currency.style.fontSize = '32px';
        balanceValue.style.fontSize = '36px';
        eyeBtn.querySelector('svg').style.width = '24px';
        eyeBtn.querySelector('svg').style.height = '24px';
    } else if (textLength <= 12) {
        // Valores grandes: 100.000,00
        currency.style.fontSize = '26px';
        balanceValue.style.fontSize = '30px';
        eyeBtn.querySelector('svg').style.width = '22px';
        eyeBtn.querySelector('svg').style.height = '22px';
    } else {
        // Valores muito grandes: 1.000.000,00+
        currency.style.fontSize = '22px';
        balanceValue.style.fontSize = '26px';
        eyeBtn.querySelector('svg').style.width = '20px';
        eyeBtn.querySelector('svg').style.height = '20px';
    }
}

// Inicializa o valor formatado
window.addEventListener('DOMContentLoaded', () => {
    const balanceValue = document.querySelector('.value');
    if (balanceValue) {
        savedValue = balanceValue.textContent;
        adjustFontSize();
    }
});

// Função para formatar valor como dinheiro
function formatMoney(value) {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    if (numbers === '' || numbers === '0') return '0,00';
    
    // Converte para centavos
    const cents = parseInt(numbers);
    
    // Divide por 100 para ter reais e centavos
    const reais = Math.floor(cents / 100);
    const centavos = cents % 100;
    
    // Formata com pontos de milhar
    const reaisFormatted = reais.toLocaleString('pt-BR');
    const centavosFormatted = centavos.toString().padStart(2, '0');
    
    return `${reaisFormatted},${centavosFormatted}`;
}

// Função para esconder/mostrar saldo
eyeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const balanceValue = document.querySelector('.value');
    isHidden = !isHidden;
    
    if (isHidden) {
        savedValue = balanceValue.textContent;
        balanceValue.textContent = '••••';
        currency.style.visibility = 'hidden';
        eyeBtn.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D3748" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
        `;
    } else {
        balanceValue.textContent = savedValue;
        currency.style.visibility = 'visible';
        eyeBtn.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D3748" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
        adjustFontSize();
    }
});

// Editar saldo
balanceAmount.addEventListener('click', (e) => {
    if (e.target.closest('.eye-btn')) return;
    if (isHidden) return;
    
    const balanceValue = document.querySelector('.value');
    if (!balanceValue) return;
    
    const currentValue = balanceValue.textContent;
    // Remove formatação para editar apenas números
    const numbersOnly = currentValue.replace(/\D/g, '');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = numbersOnly;
    input.style.fontSize = '52px';
    input.style.fontWeight = '700';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.width = '300px';
    input.style.background = 'transparent';
    input.style.color = '#2D3748';
    input.style.letterSpacing = '-1px';
    
    balanceValue.replaceWith(input);
    input.focus();
    input.select();
    
    // Formata enquanto digita
    input.addEventListener('input', (e) => {
        const formatted = formatMoney(e.target.value);
        const cursorPos = e.target.selectionStart;
        e.target.value = formatted;
        // Mantém cursor no final
        e.target.setSelectionRange(formatted.length, formatted.length);
    });
    
    input.addEventListener('blur', () => {
        const newValue = formatMoney(input.value);
        savedValue = newValue;
        const span = document.createElement('span');
        span.className = 'value';
        span.textContent = newValue;
        input.replaceWith(span);
        adjustFontSize();
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
});


// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('Service Worker registrado'))
            .catch(error => console.log('Erro ao registrar Service Worker:', error));
    });
}
