import debounce from "lodash.debounce";

import { configMain } from "./mainData.js";
import { getArrStorrage, removeNumberStorrage, addNumberStorrage, saveArrStorrage } from './functions.js';

const nameInput = document.querySelector('.input-start-screen__name');
const lastNameInput = document.querySelector('.input-start-screen__lastName');
const profileName = document.querySelector('.header__name');

export function initStartData() {
	if (localStorage.getItem('user-name') && nameInput) {
		nameInput.value = localStorage.getItem('user-name');
		configMain.user.name = localStorage.getItem('user-name');
	}

	if (localStorage.getItem('user-last-name') && lastNameInput) {
		lastNameInput.value = localStorage.getItem('user-last-name');
		configMain.user.lastName = localStorage.getItem('user-last-name');
	}

	if (localStorage.getItem('privacy') && document.querySelector('.main')) {
		document.querySelector('.start-screen').classList.add('_hide');
		document.querySelector('.main').classList.remove('_hide');
	}

	if (configMain.user.name && configMain.user.lastName) {
		writeUserDataToConfig();
	}

	if (profileName && configMain.user.fullName) {
		profileName.textContent = `Добро пожаловать, ${configMain.user.name}!`;
	}

	if (!localStorage.getItem('previus-page')) {
		localStorage.setItem('previus-page', 'start');
	} else if (document.querySelector('[data-person-tab]') && localStorage.getItem('previus-page') && localStorage.getItem('previus-page') == 'privacy') {
		document.querySelector('[data-person-tab]').classList.add('_tab-active');
		document.querySelector('[data-start-tab]').classList.remove('_tab-active');
		localStorage.setItem('previus-page', 'start');
	}

	if (!localStorage.getItem('favorite-items')) {
		const arr = [];
		saveArrStorrage(arr, 'favorite-items');
	}
}

export function writeUserDataToConfig() {
	configMain.user.fullName = `${configMain.user.name} ${configMain.user.lastName}`;
}

export function showMainScreen() {
	document.querySelector('.main').classList.remove('_hide');
	localStorage.setItem('privacy', true);

	if (profileName && configMain.user.name) {
		profileName.textContent = `Добро пожаловать, ${configMain.user.name}!`;
	}
}

initStartData();

export function checkActiveCardButtons(item) {
	const cardButtons = item.querySelectorAll('.card-box__button');
	const arr = [];

	if (cardButtons.length) {
		cardButtons.forEach(button => !button.classList.contains('_hide') ? arr.push(button) : false);
	}
	if (!item.classList.contains('_hide') && !arr.length) {
		item.classList.add('_hide');
	}
}

//========================================================================================================================================================
// favorite

export const favoriteConfig = {
	arrFavoriteProducts: []
}

// const favoriteItems = document.querySelector('.favorite__items');

// Проверяем есть ли в массиве продукт, по которому сейчас кликнули. Если нет - добавляем, если есть - удаляем.
export function checkAvailabilityFavoriteItem(number) {
	const favoriteArr = getArrStorrage('favorite-items');

	if (favoriteArr.includes(number)) {
		return true;
	} else {
		return false;
	}
}

//  Проверяем есть ли в массиве продукт, по которому сейчас кликнули. Если нет - добавляем, если есть - удаляем.
export function addRemoveNumberForStorrage(number, status) {
	if (status) {
		const pos = favoriteConfig.arrFavoriteProducts.indexOf(number);
		favoriteConfig.arrFavoriteProducts.splice(pos, 1);
		removeNumberStorrage('favorite-items', number);
	} else {
		if (!favoriteConfig.arrFavoriteProducts.includes(number)) {
			favoriteConfig.arrFavoriteProducts.push(number);
		}
		addNumberStorrage('favorite-items', number);
	}
}

export function cloneCurrentItemAndDrawToFavorite(item, group) {
	const newItem = item.cloneNode(true);

	const parent = document.querySelector(`[data-item-parent="${group}"]`);

	parent.append(newItem);
}

export function removeItemFromFavoriteScreen(number) {
	const favoriteItemsProducts = document.querySelectorAll('.favorite__items .item-product');

	favoriteItemsProducts.forEach(item => {
		if (item.dataset.prod == number && item.closest('.favorite__items')) {
			item.remove();
		}
	})
}

// После удаления из массива проходимся по всем карточкам, сохраняем в новый массив карточки с классом _selected и потом проверяем есть ли
// в актуальном массиве эти номера - номера, которого нет - у него забираем класс _selected
export function removeSelectedFavorite() {
	const favoriteItemsAll = document.querySelectorAll('[data-prod]');

	const arr = Array.from(favoriteItemsAll);
	const newArr = [];

	arr.forEach(block => {
		if (block.querySelector('.header-item-product__favorite').classList.contains('_selected')) newArr.push(block);
	})

	newArr.forEach(block => {
		if (!favoriteConfig.arrFavoriteProducts.includes(+block.dataset.prod)) {
			block.querySelector('.header-item-product__favorite').classList.remove('_selected');
		}
	})

}

export function checkEmptyfavoriteBlock(group = null) {
	if (group) {
		const parent = document.querySelector(`.favorite__item [data-item-parent="${group}"]`);

		const item = parent.querySelector('.item-product');

		if (item) {
			parent.classList.remove('_hide');
		} else {
			parent.classList.add('_hide');
		}
	}
}

export function checkEmptyFavGroup() {
	const groups = document.querySelectorAll('.favorite__item');

	groups.forEach(item => {
		const child = item.querySelector('.item-product');
		if (!child) {
			item.classList.add('_hide');
		} else if (child && item.classList.contains('_hide')) {
			item.classList.remove('_hide');
		}
	})
}

// Проверяем, есть ли в избранных хоть один блок - если нет, показываем текст что ничего еще не добавлено. Если есть - убираем этот текст
export function checkAvailabilityFav() {

	const currentFavoriteArr = getArrStorrage('favorite-items');
	const favoriteBody = document.querySelector('.favorite__body');

	if (!favoriteBody) return false;

	if (currentFavoriteArr.length && favoriteBody.classList.contains('_hide')) {
		favoriteBody.classList.remove('_hide');
	} else if (!currentFavoriteArr.length && !favoriteBody.classList.contains('_hide')) {
		favoriteBody.classList.add('_hide');
	}
}

// Когда перезагружаем страницу - берем данные из памяти браузера
function refreshFavoriteItems() {
	const currentFavoriteArr = getArrStorrage('favorite-items');
	if (currentFavoriteArr.length && document.querySelector('.item-product')) {
		addSelectedClassFavoriteItemsAfterRefresh(currentFavoriteArr);
	}
	checkEmptyFavGroup();
	checkAvailabilityFav();
}

function addSelectedClassFavoriteItemsAfterRefresh(currentFavoriteArr) {
	const favoriteItemsAll = document.querySelectorAll('[data-for-clone] [data-prod]');

	currentFavoriteArr.forEach(item => {
		favoriteItemsAll.forEach(block => {
			if (block.dataset.prod == item) {
				if (!favoriteConfig.arrFavoriteProducts.includes(item)) {
					favoriteConfig.arrFavoriteProducts.push(item);
				}

				const group = block.dataset.itemChild;
				block.querySelector('.header-item-product__favorite').classList.add('_selected');
				if (group) {
					cloneCurrentItemAndDrawToFavorite(block, group);
					checkEmptyfavoriteBlock(group);
				}
			}
		})
	})
}

refreshFavoriteItems();

//========================================================================================================================================================

// posts
export function showTargetSlide(item) {
	const postPopupBody = item.closest('.post-popup__body');

	const items = postPopupBody.querySelectorAll('.post-popup__content');

	removeActivsClassForButtons(postPopupBody);
	addActivsClassForButtons(item);

	removeActiveClassGroupPosts(items);
	showSingleScreenPost(item, items);

}

function removeActiveClassGroupPosts(items) {
	items.forEach(item => !item.classList.contains('_hide') ? item.classList.add('_hide') : false);
}
function showSingleScreenPost(item, items) {

	const num = +item.dataset.postBtn;

	items[num].classList.remove('_hide');
}
function removeActivsClassForButtons(parent) {
	const buttons = parent.querySelectorAll('[data-post-btn]');
	buttons.forEach(button => button.classList.contains('_active') ? button.classList.remove('_active') : false);
}
function addActivsClassForButtons(item) {
	item.classList.add('_active');
}

//========================================================================================================================================================
// filter credit cards
const creditCardsItems = document.querySelectorAll('#credit-cards .item-product');

export function filterCreditCards() {
	creditCardsItems.forEach(block => block.classList.remove('_hide'));

	if (configMain.filters.credit.freeService && configMain.filters.credit.rait && configMain.filters.credit.cash) {
		creditCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
			if (block.dataset.cash == undefined) block.classList.add('_hide');
			if (block.dataset.rate == undefined) block.classList.add('_hide');
		})
	} else if (configMain.filters.credit.freeService && !configMain.filters.credit.rait && configMain.filters.credit.cash) {
		creditCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
			if (block.dataset.cash == undefined) block.classList.add('_hide');
		})
	} else if (configMain.filters.credit.freeService && configMain.filters.credit.rait && !configMain.filters.credit.cash) {
		creditCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
			if (block.dataset.rate == undefined) block.classList.add('_hide');
		})
	} else if (!configMain.filters.credit.freeService && configMain.filters.credit.rait && configMain.filters.credit.cash) {
		creditCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
			if (block.dataset.rate == undefined) block.classList.add('_hide');
		})
	} else if (!configMain.filters.credit.freeService && !configMain.filters.credit.rait && configMain.filters.credit.cash) {
		creditCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
		})
	} else if (configMain.filters.credit.freeService && !configMain.filters.credit.rait && !configMain.filters.credit.cash) {
		creditCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
		})
	} else if (!configMain.filters.credit.freeService && configMain.filters.credit.rait && !configMain.filters.credit.cash) {
		creditCardsItems.forEach(block => {
			if (block.dataset.rate == undefined) block.classList.add('_hide');
		})
	}

}

export function changeActiveStatusFilter(storrNmae, item) {
	if (storrNmae) {
		item.classList.add('_active');
	} else if (!storrNmae && item.classList.contains('_active')) {
		item.classList.remove('_active');
	}
}

//========================================================================================================================================================
// filter debet cards
const debetCardsItems = document.querySelectorAll('#debet-cards .item-product');

export function filterDebetCards() {

	debetCardsItems.forEach(block => block.classList.remove('_hide'));

	if (configMain.filters.debet.freeService && configMain.filters.debet.yearMoney && configMain.filters.debet.cash) {
		debetCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
			if (block.dataset.free == undefined) block.classList.add('_hide');
			if (block.dataset.yearMoney == undefined) block.classList.add('_hide');
		})
	} else if (configMain.filters.debet.freeService && configMain.filters.debet.yearMoney && !configMain.filters.debet.cash) {
		debetCardsItems.forEach(block => {
			if (block.dataset.yearMoney == undefined) block.classList.add('_hide');
			if (block.dataset.free == undefined) block.classList.add('_hide');
		})
	} else if (configMain.filters.debet.freeService && !configMain.filters.debet.yearMoney && configMain.filters.debet.cash) {
		debetCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
			if (block.dataset.free == undefined) block.classList.add('_hide');
		})
	} else if (!configMain.filters.debet.freeService && configMain.filters.debet.yearMoney && configMain.filters.debet.cash) {
		debetCardsItems.forEach(block => {
			if (block.dataset.yearMoney == undefined) block.classList.add('_hide');
			if (block.dataset.cash == undefined) block.classList.add('_hide');
		})
	} else if (configMain.filters.debet.freeService && !configMain.filters.debet.yearMoney && !configMain.filters.debet.cash) {
		debetCardsItems.forEach(block => {
			if (block.dataset.free == undefined) block.classList.add('_hide');
		})
	} else if (!configMain.filters.debet.freeService && configMain.filters.debet.yearMoney && !configMain.filters.debet.cash) {
		debetCardsItems.forEach(block => {
			if (block.dataset.yearMoney == undefined) block.classList.add('_hide');
		})
	} else if (!configMain.filters.debet.freeService && !configMain.filters.debet.yearMoney && configMain.filters.debet.cash) {
		debetCardsItems.forEach(block => {
			if (block.dataset.cash == undefined) block.classList.add('_hide');
		})
	}

}

//========================================================================================================================================================
// search
export const configSearch = {
	prompt: null
}
const searchItems = document.querySelectorAll('#search-box .item-product');

// Функция - запуск функции поиска значения с отсрочкой 0,5 сек
const debounceHandler = debounce((data) => {
	searchDataHandler(data);
}, 500)


// Функция запускает обработку вводимой информации в инпут поиска города
export const searchDataHandler = (string) => {
	// Запускаем проверку городов только если не пустая строка, если пустая - обнуляем последний поиск чтобы очистить блок с городами
	if (string) {
		findDataHandler(string.toLowerCase())
	}
}

// Функция - обработчик вводимой информации в инпут поиска
const inputHandler = (e) => {
	if (e.target.value.length > 2) {
		debounceHandler(e.target.value);
	} else {
		hideAllsearchItems();
	}
}

function findDataHandler(string) {

	hideAllsearchItems();

	searchItems.forEach(item => {
		let words = item.dataset.words;

		words = words.split(',');

		words.forEach(word => {
			if (word.indexOf(string) !== -1) {
				item.classList.remove('_hide');
			}
		})
	})
}

function hideAllsearchItems() {
	searchItems.forEach(item => item.classList.add('_hide'));
}

if (document.querySelector('#search-box .header__input')) {
	document.querySelector('#search-box .header__input').addEventListener('input', inputHandler);
}
