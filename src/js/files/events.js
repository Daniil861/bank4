import {
	initStartData, checkActiveCardButtons, checkAvailabilityFavoriteItem, removeSelectedFavorite, searchDataHandler, checkEmptyfavoriteBlock,
	removeItemFromFavoriteScreen, cloneCurrentItemAndDrawToFavorite, addRemoveNumberForStorrage, configSearch, filterCreditCards, filterDebetCards,
	changeActiveStatusFilter, showTargetSlide, checkEmptyFavGroup, checkAvailabilityFav
} from './script.js';
import { configMain } from './mainData.js';
import { calcConfig, startCountCreditCalc } from './calculators.js';

const textNotifications = document.querySelector('.profile__notif');
const nameInput = document.querySelector('.input-start-screen__name');
const lastNameInput = document.querySelector('.input-start-screen__lastName');
// const profileName = document.querySelector('.header__name');


// Объявляем слушатель событий "клик"

document.addEventListener('click', (e) => {
	let targetElement = e.target;

	if (targetElement.closest('[data-btn="privacy-to-main"')) {
		location.href = 'index.html';
	}

	//====
	// main

	if (targetElement.closest('.single-card__icon-close')) {
		targetElement.closest('.single-card').classList.add('_hide');
	}

	if (targetElement.closest('.card-box__icon-close')) {
		targetElement.closest('.card-box__button').classList.add('_hide');
		checkActiveCardButtons(targetElement.closest('.card-box__button-box'));
	}

	//====
	// header - show/hide filter box

	if (targetElement.closest('.popup') && !targetElement.closest('.header__icon-settings')) {
		const parent = targetElement.closest('.popup');
		const headerTitleBox = parent.querySelector('.header__title-box');
		if (headerTitleBox && headerTitleBox.classList.contains('_visible') && !targetElement.closest('.header__filter-box')) {
			headerTitleBox.classList.remove('_visible');
		}
	}

	if (targetElement.closest('.header__icon-settings')) {
		const parent = targetElement.closest('.header__title-box');

		parent.classList.contains('_visible') ?
			parent.classList.remove('_visible') :
			parent.classList.add('_visible');
	}

	//=====
	// posts
	if (targetElement.closest('[data-post-btn]')) {
		showTargetSlide(targetElement.closest('[data-post-btn]'))
	}

	//======
	// profile

	if (targetElement.closest('[data-btn="notifications"]')) {
		configMain.notifications = !configMain.notifications;

		if (configMain.notifications) {
			targetElement.closest('[data-btn="notifications"]').classList.add('_active');
		} else if (!configMain.notifications && targetElement.closest('[data-btn="notifications"]').classList.contains('_active')) {
			targetElement.closest('[data-btn="notifications"]').classList.remove('_active');
		}
	}

	if (targetElement.closest('[data-btn="recomendations"]')) {
		configMain.recomendations = !configMain.recomendations;

		if (configMain.recomendations) {
			targetElement.closest('[data-btn="recomendations"]').classList.add('_active');
		} else if (!configMain.recomendations && targetElement.closest('[data-btn="recomendations"]').classList.contains('_active')) {
			targetElement.closest('[data-btn="recomendations"]').classList.remove('_active');
		}
	}

	if (targetElement.closest('[data-btn="privacy"]')) {
		localStorage.setItem('previus-page', 'privacy');
		location.href = 'privacy.html';
	}

	//===
	// calcs

	if (targetElement.closest('[data-btn="credit-calc"]')) {
		startCountCreditCalc();
	}

	//===
	// filters

	//credit
	if (targetElement.closest('[data-btn="credit-free-btn"]')) {
		configMain.filters.credit.freeService = !configMain.filters.credit.freeService;

		changeActiveStatusFilter(configMain.filters.credit.freeService, targetElement.closest('[data-btn="credit-free-btn"]'));
		filterCreditCards();
	}
	if (targetElement.closest('[data-btn="credit-rate-btn"]')) {
		configMain.filters.credit.rait = !configMain.filters.credit.rait;

		changeActiveStatusFilter(configMain.filters.credit.rait, targetElement.closest('[data-btn="credit-rate-btn"]'));
		filterCreditCards();
	}
	if (targetElement.closest('[data-btn="credit-cash-btn"]')) {
		configMain.filters.credit.cash = !configMain.filters.credit.cash;

		changeActiveStatusFilter(configMain.filters.credit.cash, targetElement.closest('[data-btn="credit-cash-btn"]'));
		filterCreditCards();
	}

	//debet
	if (targetElement.closest('[data-btn="debet-free-btn"]')) {
		configMain.filters.debet.freeService = !configMain.filters.debet.freeService;

		changeActiveStatusFilter(configMain.filters.debet.freeService, targetElement.closest('[data-btn="debet-free-btn"]'));
		filterDebetCards();
	}
	if (targetElement.closest('[data-btn="debet-year-money-btn"]')) {
		configMain.filters.debet.yearMoney = !configMain.filters.debet.yearMoney;

		changeActiveStatusFilter(configMain.filters.debet.yearMoney, targetElement.closest('[data-btn="debet-year-money-btn"]'));
		filterDebetCards();
	}
	if (targetElement.closest('[data-btn="debet-cash-btn"]')) {
		configMain.filters.debet.cash = !configMain.filters.debet.cash;

		changeActiveStatusFilter(configMain.filters.debet.cash, targetElement.closest('[data-btn="debet-cash-btn"]'));
		filterDebetCards();
	}

	//===
	// favorite logic

	if (targetElement.closest('.header-item-product__favorite')) {
		const number = +targetElement.closest('[data-prod]').dataset.prod;
		const group = targetElement.closest('[data-prod]').dataset.itemChild;

		const isAlredyFavorit = checkAvailabilityFavoriteItem(number);

		if (isAlredyFavorit) { // Если блок уже в массиве избранных

			// Убираем класс _selected на блок, чтобы изменить цвет иконки
			targetElement.closest('.header-item-product__favorite').classList.remove('_selected');

			// Удаляем со страницы избранного блок с номером
			removeItemFromFavoriteScreen(number);

			// Удаляем число из массива избранных блоков
			addRemoveNumberForStorrage(number, true);

			removeSelectedFavorite();
		} else {
			// Вешаем класс _selected на блок, чтобы изменить цвет иконки
			targetElement.closest('.header-item-product__favorite').classList.add('_selected');

			//	Клонируем блок и записываем его на страницу избранных блоков
			cloneCurrentItemAndDrawToFavorite(targetElement.closest('[data-prod'), group);

			// Добавляем новое число в массив избранных блоков
			addRemoveNumberForStorrage(number, false);
		}

		checkEmptyfavoriteBlock(group);
		checkEmptyFavGroup();
		checkAvailabilityFav();
	}

	//===
	// search

	if (targetElement.closest('.header__input') && !targetElement.closest('#search-box')) {
		setTimeout(() => {
			document.querySelector('#search-box .header__input').focus();
		}, 150);
	}
})


// Когда пользователь вводит данные при входе - записываем в сессионную память и далее используем эти данные
if (nameInput) {
	nameInput.addEventListener('change', (e) => {
		configMain.user.name = e.target.value;
		localStorage.setItem('user-name', configMain.user.name);
	})
}

if (lastNameInput) {
	lastNameInput.addEventListener('change', (e) => {
		configMain.user.lastName = e.target.value;
		localStorage.setItem('user-last-name', configMain.user.lastName);
	})
}







