const {
	OSRecord
} = require("../includes.js")
class OSDatabase {
	constructor(cache = new Set()) {
		this.keywordsCache = cache
		this._data = []
	}
	configure(main, secondary = null, lang = "en", completion=()=>{}) {
		this.main = main
		this.secondary = secondary
		const tokenize = require("../Helpers/tokenize.js")

		const length = this.select().length
		let array = []
		for (var i = 0; i < length; i+=1000) {
			const max = i + 1000 > length ? length : i + 1000
			array.push([i, max])
		}

		array.forEach((range, index) => {
			const select = this.select(null, "keywords", range)
			console.log(select.length)
			select.forEach(record => {
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
			completion(array[index][1])
		})
	}
	select(contains = null, key="keywords", range=null) {
		if (typeof this._sFunction != "undefined") {
			return this._sFunction(key, contains, range)
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
					if (record.data[key].toLowerCase().split(" ").includes(contains)) {
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
