import * as Storage from "./storage.js";

const blocklistStorageKey = "blocklist";

export default class {
	constructor(){
		this._listCache = [];
	}

	async add(url){
		await this._fillCacheIfEmpty();

		let result = {};

		let isInBlockList = await this.contains(url);
		if (isInBlockList) {
			// URL is already in list
			result.alreadyInList = true;
			return result;
		}
		
		this._listCache = [...this._listCache, url ];

		try {
			await this._saveList();
		}
		catch (err) {
			// Undo last add.
			const itemIndex = this._listCache.indexOf(url);
			this._listCache.splice(itemIndex, 1);
			result.error = err;
		}

		return result;
} 
	
	async remove(url) {
		await this._fillCacheIfEmpty();
		let result = {};
		
		let itemIndex = this._listCache.indexOf(url);
		
		// URL isn't in list
		if (itemIndex === -1) {
			result.error = new Error("URL isn't in list");
			return result;
		}

		this._listCache.splice(itemIndex, 1);

		try {
			await this._saveList();
		}
		catch (err) {
			// Undo item deletion
			this._listCache.splice(itemIndex, 0, url);
			result.error = err;
		}

		return result;

	}

	async contains(url){
		await this._fillCacheIfEmpty();

		return this._listCache.indexOf(url) > -1;
	}


	async list() {
		let result = await this._fillCacheIfEmpty();
		
		if(!result.err){
			result.value = [...this._listCache];
		}

		return result;
	}

	async _fillCacheIfEmpty() {
		let result = {};
		if (this._listCache.length === 0) {
			try {
				let returnedObject = await this._loadList();
				
				// Check if value exists for key
				if(returnedObject[blocklistStorageKey]){
					this._listCache = returnedObject[blocklistStorageKey];
				}
			}
			catch(err) {
				result.error = err;
			}
		}

		return result;
	}

	async _saveList() {
		// There will be a callback to handle 
		await Storage.save(blocklistStorageKey, this._listCache);
	}

	async _loadList() {
		return await Storage.load(blocklistStorageKey);
	}
}