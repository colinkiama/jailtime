import { Controller } from "../vendor/stimulus.js";

export default class extends Controller {
	static values = { url: String };

	connect() {
		console.log("I'm a block list item!");
		console.log("Here is my url:", this.urlValue);
	}

	delete() {
		this.dispatch("delete", { detail: { url: this.urlValue } });
	}
}