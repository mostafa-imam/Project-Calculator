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