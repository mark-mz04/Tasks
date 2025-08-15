import compareImages from './screenTest.js';

window.content = {
	type: 'Frontend React Developer', // #70d6ff
	name: 'Frontender Name', // #ff70a6
	age: '12', // #ff0a54
	skills: 'HTML, CSS, JavaScript, Jquery, PHP, Canvas, Effector, Node.js.', // #ff9770
	date: '07.02.2024', // #bfd200
};

const codeDiv = document.getElementById('code');
const btn = document.getElementById('btn');

btn.addEventListener('click', compareImages);

const type = convertToBinary(window.content.type, 32);
const name = convertToBinary(window.content.name, 16);
const age = convertToBinary(window.content.age, 2);
const skills = convertToBinary(window.content.skills, 64);
const date = convertToBinary(window.content.date, 10);

const generalBinaryCode = [];
let generalRow = [];

renderFunction(type, '#70d6ff');
renderFunction(name, '#ff70a6');
renderFunction(age, '#ff0a54');
renderFunction(skills, '#ff9770');
renderFunction(date, '#bfd200');

checkSum();

function convertToBinary(str, numberOfSymbols) {
	let ascii = [];
	for (let i = 0; i < str.length; i++) {
		ascii.push(str[i].charCodeAt(0));
	}

	let binaryCode = [];
	for (let i = 0; i < ascii.length; i++) {
		const binaryVal = ascii[i].toString(2);
		const valueToEightCharacters = convertValueToEightSymbols(binaryVal);
		binaryCode.push(valueToEightCharacters);
	}

	return { str, ascii, binaryCode, numberOfSymbols };
}

function createBox(isColor, color = null) {
	const box = document.createElement('div');
	box.style.width = '8px';
	box.style.height = '8px';
	box.style.backgroundColor = isColor ? color : '#fff';
	return box;
}

function convertValueToEightSymbols(str) {
	let numberOfZeros = 8 - str.length;
	let newStr = str;
	while (numberOfZeros) {
		newStr = '0' + newStr;
		--numberOfZeros;
	}
	return newStr;
}

function renderFunction(field, color) {
	let count = field.numberOfSymbols;

	let fragment = new DocumentFragment();

	field.binaryCode.forEach((str) => {
		for (let i = 0; i < str.length; i++) {
			setGeneralRow(str[i]);

			if (+str[i]) {
				fragment.append(createBox(1, color));
			} else {
				fragment.append(createBox(0));
			}
		}
		count--;
	});

	let missingSymbols = count * 8;
	while (missingSymbols) {
		setGeneralRow('0');
		fragment.append(createBox(0));
		missingSymbols--;
	}

	codeDiv.appendChild(fragment);
}

function setGeneralRow(el) {
	generalRow.push(el);
	if (generalRow.length === 32) {
		generalBinaryCode.push(generalRow);
		generalRow = [];
	}
}

function checkSum() {
	let count = 0;
	const checkRowValue = [];
	let columnSum = '';
	let fragment = new DocumentFragment();

	while (count < 32) {
		generalBinaryCode.forEach((el) => {
			columnSum += el[count];
		});

		const binaryVal = parseInt(columnSum, 2);
		checkRowValue.push(binaryVal);
		columnSum = '';
		count++;
	}

	checkRowValue.forEach((val) => {
		if (val % 2) {
			fragment.append(createBox(0));
		} else {
			fragment.append(createBox(1, '#000'));
		}
	});

	codeDiv.appendChild(fragment);
}
