const {
	OSDatabase,
	OSQuery,
	OSRecord
} = require("../../includes.js")

class OSNormal {
	constructor(query, db, completion) {
		this.query = query
		this.callback = completion
		this.db = db
		this.search()
	}
	_getKeys() {
		const set = new Set()
		const querySpecificKeys = this.query.keys
		if (querySpecificKeys != null) {
			querySpecificKeys.forEach(key => {
				set.add(key)
			})
		}
		set.add("keywords")
		return [...set]
	}
	search() {
		const keys = this._getKeys()
		const keywords = Object.keys(this.query.parsed.keywords)

		keys.forEach(key => {
			keywords.forEach(word => {
				const select = this.db.select(word, key)
				select.forEach(record => {
					this.callback(record)
				})
			})
		})
	}
}

module.exports = OSQuick;
