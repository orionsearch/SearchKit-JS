class OSNormal {
	constructor(query, db, completion, options) {
		this.query = query
		this.callback = completion
		this.db = db
		this.options = options

		this.cacheFilters()
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
	getKeywords() {
		const levenshtein = require("../../Helpers/levenshtein.js")
		const keywords = Object.keys(this.query.parsed.keywords)
		const cache = [...this.db.keywordsCache]
		let out = []
		keywords.forEach(key => {
			const scores = cache.map(a => levenshtein(a, key))

			function getMin(arr) {
				let len = arr.length;
				let min = Infinity;

				while (len--) {
					min = arr[len] < min ? arr[len] : min;
				}
				return min;
			}

			const max = getMin(scores)

			const i = scores.indexOf(max)
			out.push(cache[i])
		})
		return out
	}

	cacheFilters() {
		this.filters = this.query.parsed.filters.filter(a => this.options.filters.has(a[0]))
	}

	search() {
		const keys = this._getKeys()
		const keywords = this.getKeywords()
		let records = new Set()
		keys.forEach(key => {
			keywords.forEach(word => {
				const select = this.db.select(word, key)
				select.forEach(record => {
					let emplacement = record.data[key]
					if (typeof emplacement == "string") {
						emplacement = emplacement.split(" ")
					} else if (emplacement == null) {
						emplacement = []
					}
					const nbOfKeys = Array.from(emplacement).map(k => {
						if (keywords.includes(k)) {
							const s = this.query.parsed.keywords[k]

							return isNaN(s) ? 0 : s
						}
						return false
					}).filter(a => a != false).reduce((a, c) => a + c, 0) // compute the weight for each keywords

					let br = false
					this.filters.forEach(filter => {
						const reg = new RegExp(`\\b${filter[1]}\\b`, "i")

						if (typeof record.data[filter[0]] == "undefined") {
							br = true
						} else if (!reg.test(record.data[filter[0]])) {
							br = true
						}
					})
					if (br === false) {
						if (records.has(record)) {
							records.delete(record)
						}
						record.score = nbOfKeys
						records.add(record)
					}
				})
			})
		})

		const sorted = Array.from(records).sort((b, a) => a.score - b.score)
		sorted.forEach(record => {
			this.callback(record)
		})
	}
}

module.exports = OSNormal;
