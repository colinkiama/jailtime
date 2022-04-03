import { Controller } from "../vendor/stimulus.js";
import { getHostname } from "../utils/urlHelper.js"; 
import Blocklist from "../utils/blocklist.js";

export default class extends Controller {
	static targets = ["listElement"];

	async connect() {
		this.blocklist = new Blocklist();
		this.list = [];
		let listResult = await this.blocklist.list();

		if(listResult.error){
			console.error(listResult.error);
			return;
		}
		
		this.list = listResult.value;

		console.log(this.list);
		this.createListElements();
	}

	createListElements() {
		for (let i = this.list.length - 1; i >= 0; i--) {
			let url = this.list[i];
			this.addItem(url);
		}
	}

	async add() {
		let url = window.prompt("Enter a url to block:");

		try{
			let hostNameToAdd = getHostname(url);
			
			if(!hostNameToAdd){
				window.alert("You didn't enter a valid URL");
				return;
			}
			
			let addResult = await this.blocklist.add(url);

			if (addResult.error){
				console.error(addResult.error);
				return;
			}

			this.addItem(hostNameToAdd);
				
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

		let removeButton = document.createElement("button");
		removeButton.textContent = "Remove";
		removeButton.setAttribute("data-action", "blocklist-item#delete");

		let actionsCell = document.createElement("td");
		actionsCell.classList.add("actions");
		actionsCell.appendChild(removeButton);

		let itemRow = document.createElement("tr");
		itemRow.appendChild(urlCell);
		itemRow.appendChild(actionsCell);
		itemRow.setAttribute("data-controller", "blocklist-item");
		itemRow.setAttribute("data-action", "blocklist-item:delete->blocklist#deleteItem");


		this.listElementTarget.appendChild(itemRow);
		console.log("Added list element:", url);
	}

	async deleteItem(args) {
		console.log("Eleemnt to delete:", args.srcElement);
		console.log("Delete item args:", args.detail);


		let deletionResult = await this.blocklist.remove(args.detail.url);
		if (deletionResult.error) {
			console.error(deletionResult.error);
			return;
		}

		let deletionIndex = this.list.indexOf(args.detail.url);
		if (deletionIndex > -1) {
			this.list.splice(deletionIndex);
			this.listElementTarget.removeChild(args.srcElement);
		}
		this.list.splice(deletionIndex);
		this.listElementTarget.removeChild(args.srcElement);
	}

}