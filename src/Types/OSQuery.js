class OSQuery {
	constructor(s, keys = null, filters = null) {
		this.limit = 25
		this.str = s
		this.keys = null
		this.filters = null
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
		const tokens = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
						.replace(/\s{2,}/g," ")
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
}
