// TODO: Have different versions of this file for each browser
// you are targeting.

const BLOCKLIST_KEY = "blocklist";

chrome.runtime.onInstalled.addListener(() => {
  // Page actions are disabled by default and enabled on select tabs
  chrome.action.disable();

  console.log("declarativeContent:", chrome);
  // Clear all rules to ensure only our expected rules are set
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
  	// Ensure that extenstion action is not active in chrome pages
    let activeFilterRule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { schemes: ["http", "https", "chrome-extension"] },
        })
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    // Finally, apply our new array of rules
    let rules = [activeFilterRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

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

function filterW3Prefix(url) {
	if (url.startsWith("www.")) {
		return url.replace("www.", "");
	}

	return url;
}

async function loadBlocklistFromStorage() {
	let loadedObject = await chrome.storage.sync.get(BLOCKLIST_KEY);
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


async function handleUpdated(tabId, changeInfo, tabInfo) {
	let blocklist = await loadBlocklistFromStorage();
	let updatedTabHostname = filterW3Prefix(getHostname(tabInfo.url));
	console.log("Updated tab host name:", updatedTabHostname);
	console.log("Blocklist:", blocklist);	

	let isInBlockList = blocklist.indexOf(updatedTabHostname) > -1;
	if (isInBlockList) {
		let blockPageUrl = new URL(chrome.runtime.getURL("views/site-blocked.html"));
		blockPageUrl.searchParams.append("site", updatedTabHostname);
		await chrome.tabs.update(tabId, {
			url: blockPageUrl.toString(),
		});
	}
}