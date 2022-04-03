// TODO: Have different versions of this file for each browser
// you are targeting.

export function load(key) {
	return window.chrome.storage.sync.get(key);
}

export function save(key, value) {
	return window.chrome.storage.sync.set({[key]: value})
}