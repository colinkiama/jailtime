import { Controller } from "../vendor/stimulus.js";

export default class extends Controller {
	static targets = ["url"];

	connect() {
		console.log("I'm a block list item!");
		console.log("Here is my url:", this.urlTarget.textContent);
	}

	delete() {
		this.dispatch("delete", { detail: { url: this.urlTarget.textContent } });
	}
}