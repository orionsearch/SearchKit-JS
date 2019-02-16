const { OSRecord } = require("../includes.js")
class OSDatabase {
	constructor(cache=new Set()) {
		this.keywordsCache = cache
		this._data = []
	}
	configure(main, secondary=null, lang="en") {
		const stopwords = require('stopwords-iso');
		const stops = stopwords[lang]
		function tokenize(text) {
			const t = text.toLowerCase()
			const tokens = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
				.replace(/\s{2,}/g, " ")
				.split(" ")
			return tokens.filter(a => a != "")
		}
		this.select().forEach(record => {
			const keys = new Set()
			tokenize(record.data[main]).forEach(t => {
				this.keywordsCache.add(t)
				keys.add(t)
			})
			if (secondary != null) {
				tokenize(record.data[secondary]).forEach(t => {
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
	select(contains=null) {
		if (typeof this._sFunction != "undefined") {
			return this._sFunction(contains)
		} else {
			return this._select(contains)
		}
	}
	add(records, main, secondary=null) {
		const stopwords = require('stopwords-iso');
		const stops = stopwords[lang]
		function tokenize(text) {
			const t = text.toLowerCase()
			const tokens = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
				.replace(/\s{2,}/g, " ")
				.split(" ")
			return tokens.filter(a => a != "")
		}
		records.forEach(record => {
			const keys = new Set()
			tokenize(record.data[main]).forEach(t => {
				this.keywordsCache.add(t)
				keys.add(t)
			})
			if (secondary != null) {
				tokenize(record.data[secondary]).forEach(t => {
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
	_select(contains) {
		if (contains == null) {
			return this._data
		} else {
			let out = []
			this._data.forEach(record => {
				if (record.data.keywords.has(contains)) {
					out.push(record)
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
