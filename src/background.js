// TODO: Have different versions of this file for each browser
// you are targeting.

const BLOCKLIST_KEY = "blocklist";

browser.runtime.onInstalled.addListener(() => {
  // Page actions are disabled by default and enabled on select tabs
  browser.action.disable();

  // Clear all rules to ensure only our expected rules are set
  browser.declarativeContent.onPageChanged.removeRules(undefined, () => {
  	// Ensure that extenstion action is not active in chrome pages
    let activeFilterRule = {
      conditions: [
        new browser.declarativeContent.PageStateMatcher({
          pageUrl: { schemes: ["http", "https", "chrome-extension"] },
        })
      ],
      actions: [new browser.declarativeContent.ShowAction()],
    };

    // Finally, apply our new array of rules
    let rules = [activeFilterRule];
    browser.declarativeContent.onPageChanged.addRules(rules);
  });
});

browser.tabs.onUpdated.addListener(handleUpdated);

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
	let loadedObject = await browser.storage.sync.get(BLOCKLIST_KEY);
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

	let isInBlockList = blocklist.indexOf(updatedTabHostname) > -1;
	if (isInBlockList) {
		let blockPageUrl = new URL(browser.runtime.getURL("views/site-blocked.html"));
		blockPageUrl.searchParams.append("site", updatedTabHostname);
		await browser.tabs.update(tabId, {
			url: blockPageUrl.toString(),
		});
	}
}