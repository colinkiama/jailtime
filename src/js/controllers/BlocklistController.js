import { Controller } from "../vendor/stimulus.js";
import { getHostname } from "../utils/urlHelper.js"; 
import Blocklist from "../utils/blocklist.js";

export default class extends Controller {
	static targets = ["listElement", "urlInput", "addSiteStatusMessage"];

	async connect() {
		this.blocklist = new Blocklist();
		this.list = [];
		let listResult = await this.blocklist.list();

		if(listResult.error){
			console.error(listResult.error);
			return;
		}
		
		this.list = listResult.value;

		this.createListElements();
	}

	createListElements() {
		for (let i = 0; i < this.list.length; i++) {
			let url = this.list[i];
			this.addItem(url);
		}
	}

	async add() {
		let url = this.urlInputTarget.value;

		try{
			let hostNameToAdd = getHostname(url);
			
			if(!hostNameToAdd){
				this.addSiteStatusMessageTarget.textContent = "You didn't enter a valid URL";
				return;
			}
			
			let addResult = await this.blocklist.add(url);

			if (addResult.error){
				console.error(addResult.error);
				this.addSiteStatusMessageTarget.textContent = "Internal error" + 
					" occured while adding site to blocklist";
				return;
			}

			if (addResult.alreadyInList) {
				this.addSiteStatusMessageTarget.textContent = "This website already is in the blocklist";
				return;
			}

			if (this.addSiteStatusMessageTarget.textContent.length > 0) {
				this.addSiteStatusMessageTarget.textContent = "";
			}

			this.list.push(hostNameToAdd);
			this.addItem(hostNameToAdd);
			this.urlInputTarget.value = "";
				
		}
		catch (err) {
			window.alert(err);
		}
	}

	addItem(url) {
		/**
		 * A blocklist item:
		 * 
		 * <tr>
		 *   <td>yolomail.net</td>
		 *	 <td class="actions"><button>Delete</button></td>
		 * </tr>
		 * 
		**/ 
		let urlCell = document.createElement("td");
		urlCell.textContent = url;
		urlCell.setAttribute("data-blocklist-item-target", "url");

		let deleteIconUseElement = document.createElement("use");
		deleteIconUseElement.setAttribute("href", "/assets/icons/spritemap.svg#sprite-delete");
		
		let svgElement = document.createElement("svg");
		svgElement.classList.add("icon");
		svgElement.appendChild(deleteIconUseElement);

		let deleteButton = document.createElement("button");
		deleteButton.classList.add("tertiary");
		deleteButton.setAttribute("data-action", "blocklist-item#delete");
		deleteButton.setAttribute("title", "Delete");

		// You need to flush the innerHTML to get the `<use>` tag to load icons
		// Source: https://stackoverflow.com/questions/27751928/force-redraw-of-svg-when-using-use-for-svg-data
		deleteButton.innerHTML = "";
		deleteButton.innerHTML = svgElement.outerHTML;

		let actionsCell = document.createElement("td");
		actionsCell.classList.add("actions");		
		actionsCell.appendChild(deleteButton);

		let itemRow = document.createElement("tr");
		itemRow.appendChild(urlCell);
		itemRow.appendChild(actionsCell);
		itemRow.setAttribute("data-controller", "blocklist-item");
		itemRow.setAttribute("data-action", "blocklist-item:delete->blocklist#deleteItem");


		this.listElementTarget.appendChild(itemRow);
	}

	async deleteItem(args) {
		let deletionResult = await this.blocklist.remove(args.detail.url);
		if (deletionResult.error) {
			console.error(deletionResult.error);
			return;
		}

		let deletionIndex = this.list.indexOf(args.detail.url);

		if (deletionIndex > -1) {
			this.list.splice(deletionIndex, 1);
			this.listElementTarget.removeChild(args.srcElement);
		}
	}

	async handleKeyPress(event) {
		switch(event.code) {
			case "Enter":
				await this.add();
				break;
			default:
				break;
		}
	}

}