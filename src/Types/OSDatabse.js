class OSDatabase {
	constructor() {
		this.keywordsCache = new Set()
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
			tokenize(record.data[main]).forEach(t => {
				this.keywordsCache.add(t)
			})
			if (secondary != null) {
				tokenize(record.data[secondary]).forEach(t => {
					this.keywordsCache.add(t)
				})
			}
		})
	}
	select(contains=null) {
		this._select(contains)
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
			tokenize(record.data[main]).forEach(t => {
				this.keywordsCache.add(t)
			})
			if (secondary != null) {
				tokenize(record.data[secondary]).forEach(t => {
					this.keywordsCache.add(t)
				})
			}
		})
		this._add(records)
	}
	_select(contains) {
		
	}
	_add(records) {

	}
}

module.exports = OSDatabase;
