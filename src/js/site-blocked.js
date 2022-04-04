let editBlockListButton = document.querySelector("button");

editBlockListButton.addEventListener('click', (event) => {
	window.chrome.tabs.create({
		active: true,
		url: chrome.runtime.getURL("views/settings/blocklist.html")
	});
});