
document.addEventListener('click', (e) => {
	let targetElement = e.target;

	if (targetElement.closest('[data-btn="show-iframe"]')) {
		window.alert("Back");
	}
})
