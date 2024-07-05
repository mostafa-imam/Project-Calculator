const digitButtons = Array.from(document.querySelectorAll('.digit'));
const operatorButtons = Array.from(document.querySelectorAll('.operator'));
const equals = document.querySelector('.Equals');
const result = document.querySelector('.result');
const clear = document.querySelector('.clear');
const backspaceButton = document.querySelector('.backspace-button');
const historyButton = document.querySelector('.history-button');
const history = document.querySelector('.historian');
const decimal = document.querySelector('.decimal');
const container = document.querySelector('.container');
const message = document.querySelector('.message')

let num1 = '';
let tempOperator = '';
let num2 = '';
let historyDisplay = [];
let currentHighlightedOperator = null;
let tempResult = '';

digitButtons.forEach(digit => {
    digit.addEventListener('click', handleDigitClick);
})

operatorButtons.forEach(operator => {
    operator.addEventListener('click', handleOperatorClick)
})

decimal.addEventListener('click', handleDigitClick);
equals.addEventListener('click', handleEqualsClick);
clear.addEventListener('click', handleClearClick);
backspaceButton.addEventListener('click', handleBackspaceClick);
document.addEventListener('keydown', handleKeydown);

historyButton.addEventListener('click', () => {
    clickToViewHistory();
    displayHistoryCards();
    removeHistoryCards()
})

historyButton.addEventListener('mouseenter', () => {
    if (!container.classList.contains('containerOnHistory')) {
        displayHistoryMessage();
    }
});

historyButton.addEventListener('mouseleave', () => {
    hideHistoryMessage();
});

function handleDigitClick(event) {
    let digit = event.target.dataset.digit;
    if (tempOperator === '') {
        if (num1.length < 11) {
            num1 += digit;
            display(num1);
            num2 = '';
            tempResult = '';
        }
    } else {
        if (num2.length < 11) {
        num2 += digit;
        display(num2);
        }
    }
    disableDecimal();
}

function handleEqualsClick() {
    if (num1 !== '' && tempOperator !== '' && num2 !== '') {
        tempResult = roundIfNeeded(operate(num1, tempOperator, num2));
        tempResult = tempResult.toString().length > 11 ? tempResult.toExponential(6) : tempResult;
        storeHistory(num1, tempOperator, num2, tempResult);
        display(tempResult);
        num1 = '';
        num2 = '';
        tempOperator = '';
    }
    disableDecimal();
    removeHighlightOperator();
}

function handleOperatorClick(event) {
    let operator = event.target.dataset.operator;

    if (tempResult !== '') {
        num1 = tempResult;
        tempResult = '';
    }

    if (num2 !== '') {
        tempResult = roundIfNeeded(operate(num1, tempOperator, num2));
        storeHistory(num1, tempOperator, num2, tempResult);
        num1 = tempResult;
        display(num1);
        num2 = '';
    } 

    tempOperator = operator;
    disableDecimal();
    toggleHighlightOperator(event.target);
}

function storeHistory(num1, operator, num2, result) {
    const newHistory = `${num1} ${operator} ${num2} = ${result}`;
    historyDisplay.push(newHistory);
    appendHistoryCard(newHistory);
}

function roundIfNeeded(num) {
    const numStr = num.toString();
    if (numStr.includes('.')) {
        const [integerPart, decimalPart] = numStr.split('.');
        if (decimalPart.length > 2) {
            return parseFloat(num).toFixed(2);
        }
    }
    return num;
}

function disableDecimal() {
    if (tempOperator === '') {
        decimal.disabled = num1.toString().includes('.');
    } else {
        decimal.disabled = num2.toString().includes('.');
    }
}

function toggleHighlightOperator(target) {
    if (currentHighlightedOperator) {
        currentHighlightedOperator.classList.remove('operatorClick');
    }
    target.classList.add('operatorClick');
    currentHighlightedOperator = target;
}

function removeHighlightOperator() {
    if (currentHighlightedOperator) {
        currentHighlightedOperator.classList.remove('operatorClick');
        currentHighlightedOperator = null;
    }
}

function display(dis) {
    let displayValue = dis;
    if (displayValue.length > 11) {
        displayValue = displayValue.substring(0, 11);
    }
    result.textContent = displayValue;
}

function operate(num1, operator, num2) {

    switch (operator) {
        case '+':
            return +num1 + +num2;
        case '-':
            return +num1 - +num2;
        case '*':
            return +num1 * +num2;
        case '/':
            return +num2 === 0 ? 'LOL' : +num1 / +num2;
        default:
            return 0;
    };
};

function handleClearClick() {
    num1 = '';
    tempOperator = '';
    num2 = '';
    tempResult = '';
    historyDisplay = [];
    display(0);
    disableDecimal();
    removeHighlightOperator()
    history.textContent = '';
}

function handleBackspaceClick() {
    if (tempOperator === '') {
        num1 = num1.toString().split('').slice(0, -1).join('');
        display(num1 || '0');
    } else {
        num2 = num2.toString().split('').slice(0, -1).join('');
        display(num2 || '0');
    }
    disableDecimal();
}

function appendHistoryCard(historyText) {
    let historyCard = document.createElement('div');
    historyCard.classList.add('card');
    historyCard.textContent = historyText;
    history.appendChild(historyCard);

    setTimeout(() => {
        historyCard.classList.add('visible');
    }, 10);
}

function clickToViewHistory() {
    container.classList.toggle('container');
    container.classList.toggle('containerOnHistory');
    history.classList.toggle('history');
    history.classList.toggle('historian');
}

function displayHistoryMessage() {
    message.classList.add('visible');
}

function hideHistoryMessage() {
    message.classList.remove('visible');
}

function displayHistoryCards() {
    history.textContent = '';
    historyDisplay.forEach(item => {
        let historyCard = document.createElement('div');
        historyCard.classList.add('card');
        historyCard.textContent = item;
        history.appendChild(historyCard);

        setTimeout(() => {
            historyCard.classList.add('visible');
        }, 10);
    });
}

function removeHistoryCards() {
    if (!container.classList.contains('containerOnHistory')) {
        history.textContent = '';
    }
}

function handleKeydown(event) {
    const key = event.key;
    if (/\d/.test(key)) {
        handleDigitClick({target: {dataset: {digit: key}}});
    } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperatorClick({target: {dataset: {operator: key}}});
    } else if (key === 'Enter') {
        handleEqualsClick();
    } else if (key === 'Backspace') {
        handleBackspaceClick();
    } else if (key === 'Escape') {
        handleClearClick();
    } else if (key === '.') {
        handleDigitClick({target: {dataset: {digit: key}}});
    }
}

disableDecimal();