
document.addEventListener('click', (e) => {
	let targetElement = e.target;

	if (targetElement.closest('[data-modal]') && targetElement.closest('[data-modal]').dataset.id) {
		showModal(targetElement.closest('[data-modal]'));
	}
})

function showModal(button) {
	const id = button.dataset.id;
	window.alert(`Identificator: ${id}`);
}


