import { Controller } from "../vendor/stimulus.js";
import { getHostname } from "../utils/urlHelper.js";
import Blocklist from "../utils/blocklist.js";
 
let BLOCK_PAGE_URL = new URL(chrome.runtime.getURL("views/site-blocked.html"));

export default class extends Controller {
	static targets = ["url", "status", "blockButton"]
	static classes = ["blocked"];

	async connect() {
		let tabQueryResult = await window.chrome.tabs.query({active: true, currentWindow: true});

		if(tabQueryResult.length > 0) {
			this.currentTab = tabQueryResult[0];
			this.url = getHostname(this.currentTab.url);
			if (this.url == getHostname(BLOCK_PAGE_URL)) {
				this.url = new URL(this.currentTab.url).searchParams.get("site");
			}
		} 
		
		if (!this.url) {
			this._showNoUrlState();
			return;
		}
		
		this.urlTarget.textContent = this.url;

		this.blocklist = new Blocklist();

		this.isBlocked = await this.blocklist.contains(this.url);
		this._updateElements();
		
	}

	_showNoUrlState() {
		this.blockButtonTarget.disabled = true;
		this.urlTarget.textContent = "Not available for this page";
		this.statusTarget.textContent = "";
	}

	_updateElements() {
		this._updateStatus();
		this._updateBlockButton();
	}

	_updateBlockButton() {
		if (this.isBlocked) {

			// this.blockButtonTarget.parentNode.removeChild(this.blockButtonTarget);
			this.element.classList.add(this.blockedClass);
			this.blockButtonTarget.textContent = "Blocked";
			this.blockButtonTarget.disabled = true;
		}
	}

	_updateStatus() {
		this.statusTarget.textContent = this.isBlocked ? 
		"Blocked" : "Not Blocked"; 
	}

	navigateToSettings() {
		window.chrome.tabs.create({
			active: true,
			url: window.chrome.runtime.getURL("views/settings/blocklist.html")
		});

		// Close Popup
		window.close();
	}

	async block(){
		let addResult = await this.blocklist.add(this.url)

		if (addResult.error) {
			console.error(addResult.error);
			return;
		}

		// After succesfull callback. Block the current site
		// Update targets as needed.
		this.isBlocked = true;
		this._updateElements();

		try {
			let blockPageUrl = new URL(chrome.runtime.getURL("views/site-blocked.html"));
			blockPageUrl.searchParams.append("site", getHostname(this.url));
			await window.chrome.tabs.update(this.currentTab.id, {
				url: blockPageUrl.toString(),
			});
		}
		catch (err) {
			console.error(err);
		}
	}
}

