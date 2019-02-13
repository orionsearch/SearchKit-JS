class OSQuery {
	constructor(s, lang = "en", keys = null, filters = null) {
		this.limit = 25
		this.str = s
		this.keys = null
		this.filters = null

		const parsedFilters = this._removeAndParseFilters(s)
		const str = parsedFilters[parsedFilters.length - 1]
		const keywords = this._extractKeywords(str, lang)
		const scores = this._scoreKeywords(keywords)
		this.parsed = {
			"filters": parsedFilters.splice(-1,1),
			"keywords": scores
		}
	}
	_removeAndParseFilters(text) {
		const regex = /\S*:\S*/
		const matches = text.match(regex)
		let t = text
		let out = []
		matches.forEach(filter => {
			const split = filter.split(":")
			const name = split[0]
			const f = split[1]
			out.push([name, f])
			// remove text
			t.replace(filter, "")
		})
		out.push(t)
		return out
	}
	_extractKeywords(text, lang = "en") {
		const stopwords = require('stopwords-iso');
		const stops = stopwords[lang]
		let t = text.toLowerCase()
		const tokens = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
			.replace(/\s{2,}/g, " ")
			.split(" ")
		let out = []
		tokens.forEach(str => {
			if (!stops.includes(str)) {
				out.push(str)
			}
		})
		if (out.length != 0) {
			return out
		}
		return tokens
	}
	_scoreKeywords(keys) {
		const l = keys.length
		const uniq = [...new Set(keys)]
		let out = {}
		const count	= new Map(uniq.map(
				x => [x, uniq.filter(y => y === x).length]
		))
		uniq.forEach(key => {
			const n = count.get(key)
			out[key] = d / ld
		})
		return out
	}
}
