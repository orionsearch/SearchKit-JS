const {
	OSRecord
} = require("../includes.js")
class OSDatabase {
	constructor(cache = new Set()) {
		this.keywordsCache = cache
		this._data = []
	}
	configure(main, secondary = null, lang = "en") {
		const tokenize = require("../Helpers/tokenize.js")

		this.select().forEach(record => {
			const keys = new Set()
			tokenize(record.data[main], lang).forEach(t => {
				this.keywordsCache.add(t)
				keys.add(t)
			})
			if (secondary != null) {
				tokenize(record.data[secondary], lang).forEach(t => {
					this.keywordsCache.add(t)
					keys.add(t)
				})
			}
			if (typeof this._kFunction != "undefined") {
				this._kFunction(keys, record)
			} else {
				this._keywords(keys, record)
			}
		})
	}
	select(contains = null, key="keywords") {
		if (typeof this._sFunction != "undefined") {
			return this._sFunction(key, contains)
		} else {
			return this._select(key, contains)
		}
	}
	add(records, main, secondary = null, lang="en") {
		const tokenize = require("../Helpers/tokenize.js")

		records.forEach(record => {
			const keys = new Set()
			tokenize(record.data[main], lang).forEach(t => {
				this.keywordsCache.add(t)
				keys.add(t)
			})
			if (secondary != null) {
				tokenize(record.data[secondary], lang).forEach(t => {
					this.keywordsCache.add(t)
					keys.add(t)
				})
			}
			if (typeof this._kFunction != "undefined") {
				this._kFunction(keys, record)
			} else {
				this._keywords(keys, record)
			}
		})
		if (typeof this._aFunction != "undefined") {
			return this._aFunction(contains)
		} else {
			return this._add(records)
		}
	}
	setPlugin(select, add, keywords) {
		this._sFunction = select
		this._aFunction = add
		this._kFunction = keywords
	}
	_select(key, contains) {
		if (contains == null) {
			return this._data
		} else {
			let out = []
			this._data.forEach(record => {
				if (key == "keywords") {
					if (record.data[key].has(contains)) {
						out.push(record)
					}
				} else {
					if (record.data[key].split(" ").includes(contains)) {
						out.push(record)
					}
				}
			})
			return out
		}
	}
	_add(records) {
		records.forEach(record => {
			this._data.push(record)
		})
	}
	_keywords(keys, record) {
		record.data.keywords = keys
	}
}

module.exports = OSDatabase;
