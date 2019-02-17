const {
	OSDatabase,
	OSRecord
} = require("includes.js")

class OrionSearch {
	/* Data management */
	constructor(data, filters = []) {

	}
	add(filters) {

	}

	/* Search */

	get OSSearchType() {
		const types = {
			normal: 1,
			advanced: 2
		}
		return Object.freeze(types) // enum emulation
	}

	perform(query, type=1, completion) {

	}

	/* Plugins */
	registerPlugin(plugin) {

	}
}
module.exports = OrionSearch;
