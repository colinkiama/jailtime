import { Controller } from "../vendor/stimulus.js";
import { getHostname } from "../utils/urlHelper.js";
import Blocklist from "../utils/blocklist.js";


export default class extends Controller {
	static targets = ["url", "status", "blockButton"]

	async connect() {
		let tabQueryResult = await window.chrome.tabs.query({active: true});

		if(tabQueryResult.length > 0) {
			this.currentTab = tabQueryResult[0];
			this.url = getHostname(this.currentTab.url);

		} else {
			this.url = getHostname("urlnotfound.error");
		}
		this.blocklist = new Blocklist();
		
		if (!this.url) {
			return;
		}
		
		this.urlTarget.textContent = this.url;

		this.isBlocked = await this.blocklist.contains(this.url)
		this._updateElements();
		
	}

	_updateElements() {
		this._updateStatus();
		this._updateBlockButton();
	}

	_updateBlockButton() {
		if (this.isBlocked) {
			this.blockButtonTarget.parentNode.removeChild(this.blockButtonTarget);
		}
	}

	_updateStatus() {
		this.statusTarget.textContent = this.isBlocked ? 
		"Blocked" : "Not Blocked"; 
	}

	navigateToSettings() {
		console.log("Navigating to settings");
		window.chrome.tabs.create({
			active: true,
			url: window.chrome.runtime.getURL("views/settings/blocklist.html")
		});

		// Close Popup
		window.close();
	}

	async block(){
		console.log("Block current site")
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
			await window.chrome.tabs.update(this.currentTab.id, {
				url: window.chrome.runtime.getURL("views/site-blocked.html"),
			});
		}
		catch (err) {
			console.log(err);
		}
	}
}

