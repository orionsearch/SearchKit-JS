const {
	OSDatabase,
	OSQuery,
	OSRecord
} = require("../includes.jss")

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
		}
		return [...set]
	}
}

module.exports = OSQuick;
