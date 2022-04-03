// TODO: Have different versions of this file for each browser
// you are targeting.

const BLOCKLIST_KEY = "blocklist";

chrome.tabs.onUpdated.addListener(handleUpdated);

function getHostname(urlString){
	try {
		let hostname = new URL(urlString).hostname
		return hostname;
	}
	catch (err) {
		// Thank you for this regex! @cimnine: https://regexr.com/3e8n2 
		let domainNameRegex = /^((?:([a-z0-9]\.|[a-z0-9][a-z0-9\-]{0,61}[a-z0-9])\.)+)([a-z0-9]{2,63}|(?:[a-z0-9][a-z0-9\-]{0,61}[a-z0-9]))\.?$/gim;
		
		if (!domainNameRegex.test(urlString)) {
			return "";
		}

		return urlString;
	}
}

async function loadBlocklistFromStorage() {
	let loadedObject = await chrome.storage.sync.get(BLOCKLIST_KEY);
	console.log("Loaded object:", loadedObject);
	try {
		// Check if value exists for key
		if (loadedObject[BLOCKLIST_KEY]) {
			return loadedObject[BLOCKLIST_KEY];
		}
	} catch(err) {
		return [];
	}

	return [];
}

function checkIfInBlocklist(urls, list) {
	for (let i = 0 ; i < urls.length; i++) {
		if (list.indexOf(urls[i]) > -1) {
			return true;
		}
	}	
	return false;
}

async function handleUpdated(tabId, changeInfo, tabInfo) {
	let blocklist = await loadBlocklistFromStorage();
	let updatedTabHostname = getHostname(tabInfo.url);
	console.log("Updated tab host name:", updatedTabHostname);

	let isInBlockList = checkIfInBlocklist([updatedTabHostname, "www."+ updatedTabHostname], blocklist);
	if (isInBlockList) {
		chrome.tabs.update(tabId, {
			url: chrome.runtime.getURL("views/site-blocked.html"),
		});
	}
}