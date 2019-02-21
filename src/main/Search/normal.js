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
	getKeywords() {
		const keywords = Object.keys(this.query.parsed.keywords)
		const cache = [...this.db.keywordsCache]
		let out = []
		keywords.forEach(key => {
			const scores = cache.map(a => this._levenshtein(a, key))
			const max = Math.min(...scores)
			const i = scores.indexOf(max)
			out.push(cache[i])
		})
		return out
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
					}
					const nbOfKeys = [...emplacement].map(k => keywords.includes(k)).filter(a => a == true).length
					if (records.has(record)) {
						records.delete(record)
					}
					record.score = nbOfKeys
					records.add(record)
				})
			})
		})

		const sorted = [...records].sort((a, b) => a.score - b.score)
		sorted.forEach(record => {
			this.callback(record)
		})
	}





	/* Helpers */

	_levenshtein(a, b) {
		let alen = a.length;
		let blen = b.length;
		if (alen === 0) return blen;
		if (blen === 0) return alen;
		let tmp, i, j, prev, val, row, ma, mb, mc, md, bprev;

		if (alen > blen) {
			tmp = a;
			a = b;
			b = tmp;
		}

		row = new Int8Array(alen + 1);
		// init the row
		for (i = 0; i <= alen; i++) {
			row[i] = i;
		}

		// fill in the rest
		for (i = 1; i <= blen; i++) {
			prev = i;
			bprev = b[i - 1]
			for (j = 1; j <= alen; j++) {
				if (bprev === a[j - 1]) {
					val = row[j - 1];
				} else {
					ma = prev + 1;
					mb = row[j] + 1;
					mc = ma - ((ma - mb) & ((mb - ma) >> 7));
					md = row[j - 1] + 1;
					val = mc - ((mc - md) & ((md - mc) >> 7));
				}
				row[j - 1] = prev;
				prev = val;
			}
			row[alen] = prev;
		}
		return row[alen];
	}
}

module.exports = OSNormal;
