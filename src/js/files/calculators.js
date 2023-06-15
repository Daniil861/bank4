import { getDigFormat, changeCommaToDot } from './functions.js';

export const calcConfig = {
	credits: {
		summ: null,
		time: null,
		startPay: null,
		percent: null,

		monthPay: null,
		countMoneyOnlyPercents: null,
		summWithAllPercents: null
	}
}

//===
// credit blocks
const monthPayBlock = document.querySelector('[data-res="credit-calc-month-pay"]');
const percentsPayBlock = document.querySelector('[data-res="credit-calc-percents"]');
const allPayBlock = document.querySelector('[data-res="credit-calc-all"]');

const creditResultDataBox = document.querySelector('#credit-calc .bottom-calc-popup__data-box');
const creditEmptyDataBox = document.querySelector('#credit-calc .bottom-calc-popup__empty-data');

//=== 

export function startCountCreditCalc() {
	// Считываем данные из введенные в инпуты
	const res = getCreditCalcData();

	console.log(calcConfig);

	// Рассчитываем
	if (res) {
		countCredit();
	}
}

function getCreditCalcData() {
	const summ = document.getElementById('credit-calc-summ');
	const time = document.getElementById('credit-calc-time');
	const startPay = document.getElementById('credit-calc-start-pay');
	const percent = document.getElementById('credit-calc-percent');

	if (!summ.value || !time.value || !startPay.value || !percent.value) {
		creditResultDataBox.classList.add('_hide');
		creditEmptyDataBox.classList.add('_visible');
		return false;
	} else {
		calcConfig.credits.summ = changeCommaToDot(summ.value);
		calcConfig.credits.time = changeCommaToDot(time.value);
		calcConfig.credits.startPay = changeCommaToDot(startPay.value);
		calcConfig.credits.percent = changeCommaToDot(percent.value);

		creditResultDataBox.classList.contains('_hide') ? creditResultDataBox.classList.remove('_hide') : null;
		creditEmptyDataBox.classList.contains('_visible') ? creditEmptyDataBox.classList.remove('_visible') : null;
		return true;
	}
}

function countCredit() {
	const percent = calcConfig.credits.percent / 100 / 12;
	const month = calcConfig.credits.time * 12;
	const startSumm = calcConfig.credits.summ - calcConfig.credits.startPay;

	// Рассчитаем ежемесячный платеж только процентов

	let monthPayForPerc = Math.floor(startSumm * percent * month);
	calcConfig.credits.countMoneyOnlyPercents = getDigFormat(monthPayForPerc);

	// Ежемесячный платеж
	let everyMonthPay = startSumm * (percent + percent / (((1 + percent) ** month) - 1));
	everyMonthPay = Math.floor(everyMonthPay);
	calcConfig.credits.monthPay = getDigFormat(everyMonthPay);

	// Стоимость кредита - сумма кредита + проценты за весь срок
	calcConfig.credits.summWithAllPercents = getDigFormat(startSumm + monthPayForPerc);

	writeCreditData();
}

function writeCreditData() {
	monthPayBlock.textContent = `${calcConfig.credits.monthPay} ₽`;
	percentsPayBlock.textContent = `${calcConfig.credits.countMoneyOnlyPercents} ₽`;
	allPayBlock.textContent = `${calcConfig.credits.summWithAllPercents} ₽`;
}

