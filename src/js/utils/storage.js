// TODO: Have different versions of this file for each browser
// you are targeting.

export function load(key) {
	return window.browser.storage.sync.get(key);
}

export function save(key, value) {
	return window.browser.storage.sync.set({[key]: value})
}