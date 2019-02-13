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
}
