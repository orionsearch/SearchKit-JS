const {
	OSDatabase,
	OSRecord
} = require("../includes.js")

class OrionSearch {
	/* Data management */
	constructor(data, filters = []) {
		this.db = data
		this.filters = filters
	}
	add() {
		const args = [...arguments]
		args.forEach(filter => {
			this.filters.push(filter)
		})
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
