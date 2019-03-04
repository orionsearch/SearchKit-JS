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
			quick: 0,
			normal: 1,
			advanced: 2
		}
		return Object.freeze(types) // enum emulation
	}

	perform(query, type=1, completion) {
		const options = {
			filters: new Set(this.filters)
		}
		switch (type) {
			case this.OSSearchType.quick:
				const OSQuick = require("./Search/quick.js")
				return new OSQuick(query, this.db, completion, options)
				break;
			case this.OSSearchType.normal:
				const OSNormal = require("./Search/normal.js")
				return new OSNormal(query, this.db, completion, options)
				break;
			case this.OSSearchType.advanced:
				throw "[OrionSearch] Advanced search type is currently not supported."
				break;
			default:
				throw "[OrionSearch] You should choose a valid search type"
		}
	}

	/* Plugins */
	registerPlugin(plugin) {

	}
}
module.exports = OrionSearch;
