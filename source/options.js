// eslint-disable-next-line import/no-unassigned-import
import 'webext-base-css';
import './options.css';

import optionsStorage from './options-storage.js';

const colorRangeInputs = [...document.querySelectorAll('input[type="range"][name^="color"]')];
const colorNumberInputs = [...document.querySelectorAll('input[type="number"][name^="color"]')];
const splitNumberInputs = [...document.querySelectorAll('input[type="number"][name^="rate"]')];
const output = document.querySelector('.color-output');

function updateOutputColor() {
	output.style.backgroundColor = `rgb(${colorRangeInputs[0].value}, ${colorRangeInputs[1].value}, ${colorRangeInputs[2].value})`;
}

function updateColorInputField(event) {
	colorNumberInputs[colorRangeInputs.indexOf(event.currentTarget)].value = event.currentTarget.value;
}

function updateSplitInputField(event) {
	splitNumberInputs[splitNumberInputs.indexOf(event.currentTarget)].value = event.currentTarget.value;
}

for (const input of colorRangeInputs) {
	input.addEventListener('input', updateOutputColor);
	input.addEventListener('input', updateColorInputField);
}

for (const input of splitNumberInputs) {
	input.addEventListener('input', updateSplitInputField);
}

async function init() {
	await optionsStorage.syncForm('#options-form');
	updateOutputColor();
}

init();
