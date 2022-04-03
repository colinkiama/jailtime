import { Controller } from "../vendor/stimulus.js";

export default class extends Controller {
	static targets = ["listElement"];

	async connect() {
		this.list = ["yolomail.net", "bookface.com"];
		this.createlistElements();
	}

	createlistElements() {
		for (let i = this.list.length - 1; i >= 0; i--) {
			let url = this.list[i];
			this.addItem(url);
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

	deleteItem(args) {
		console.log("Delete item args:", args);
	}

}