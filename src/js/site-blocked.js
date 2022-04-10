let editBlockListButton = document.querySelector("button");

editBlockListButton.addEventListener('click', (event) => {
	window.browser.tabs.create({
		active: true,
		url: browser.runtime.getURL("views/settings/blocklist.html")
	});
});