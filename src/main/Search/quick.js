const {
	OSDatabase,
	OSQuery,
	OSRecord
} = require("../../includes.js")

class OSQuick {
	constructor(query, db, completion) {
		this.query = query
		this.callback = completion
		this.db = db
	}
	_getKeys() {
		const set = new Set()
		const querySpecificKeys = this.query.keys
		if (querySpecificKeys != null) {
			querySpecificKeys.forEach(key => {
				set.add(key)
			})
		} else {
			set.add("keywords")
		}

		return [...set]
	}
}

module.exports = OSQuick;
