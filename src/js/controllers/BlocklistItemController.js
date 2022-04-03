import { Controller } from "../vendor/stimulus.js";

export default class extends Controller {
	static targets = ["url"];

	connect() {
		
	}

	delete() {
		this.dispatch("delete", { detail: { url: this.urlTarget.textContent } });
	}
}