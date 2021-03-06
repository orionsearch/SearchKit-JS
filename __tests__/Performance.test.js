const {
	OSDatabase,
	OSRecord,
	OSQuery,
	OrionSearch
} = require(__testDir + "../index.js")

eye.describe("Normal", () => {
	eye.describe("Small", () => {
		const data = require(__testDir + '../node_modules/better-sqlite3')(__testDir + '../../TestDB/summary_small.db');
		const db = new OSDatabase()
		db.setPlugin(
			(key, contains, range) => {
				const r = range == null ? [0, Number.MAX_SAFE_INTEGER] : range
				let rows = []
				if (contains == null) {
					const query = data.prepare(`SELECT rowid, * FROM main WHERE rowid BETWEEN ${r[0]} AND ${r[1]}`)
					rows = query.all()
				} else {
					const query = data.prepare(`SELECT rowid, * FROM main WHERE ${key} LIKE "%${contains}%" AND rowid BETWEEN ${r[0]} AND ${r[1]}`)
					rows = query.all()
				}
				let out = []
				rows.forEach(row => {
					const record = new OSRecord(row)
					record.main("headlines")
					out.push(record)
				})
				return out
			},
			add => {
				const query = data.prepare(`INSERT INTO main VALUES (${add.values})`)
				query.run()
			},
			(keywords, record) => {
				const keyQuery = data.prepare(`UPDATE main SET keywords = "${[...keywords].join(' ')}" WHERE ${record.main} = '${record.data[record.main].replace(/\'/g,"''")}';`)
				keyQuery.run()
			}
		)
		db.configure("headlines", "text")

		eye.test("Configure", "node",
			$ => $(db.keywordsCache.size).Equal(22266)
		)

		const os = new OrionSearch(db)

		eye.test("Search", "node",
			$ => {
				const start = process.hrtime()
				const query = new OSQuery("Donald Trump")

				let out = []
				os.perform(query, os.OSSearchType.normal, record => {
					out.push(record)
				})
				const end = process.hrtime(start);
				const time = Math.round((end[0] * 1000) + (end[1] / 1000000))
				console.log(`Found: ${out.length} records in ${time} ms`)
				return $(time).isSmaller(300) // 300 ms
			}
		)
	})
	eye.describe("Big", () => {
		const data = require(__testDir + '../node_modules/better-sqlite3')(__testDir + '../../TestDB/summary_big.db');
		const db = new OSDatabase()
		db.setPlugin(
			(key, contains, range) => {
				const r = range == null ? [0, Number.MAX_SAFE_INTEGER] : range
				let rows = []
				if (contains == null) {
					const query = data.prepare(`SELECT rowid, * FROM main WHERE rowid BETWEEN ${r[0]} AND ${r[1]}`)
					rows = query.all()
				} else {
					const query = data.prepare(`SELECT rowid, * FROM main WHERE ${key} LIKE "%${contains}%" AND rowid BETWEEN ${r[0]} AND ${r[1]}`)
					rows = query.all()
				}
				let out = []
				rows.forEach(row => {
					const record = new OSRecord(row)
					record.main("headlines")
					out.push(record)
				})
				return out
			},
			add => {
				const query = data.prepare(`INSERT INTO main VALUES (${add.values})`)
				query.run()
			},
			(keywords, record) => {
				const keyQuery = data.prepare(`UPDATE main SET keywords = "${[...keywords].join(' ')}" WHERE rowid = ${record.data.rowid};`)
				keyQuery.run()
			}
		)
		db.configure("headlines", "text", "en", i => {
			console.log(`Tokenized ${i} rows`)
		})

		eye.test("Configure", "node",
			$ => $(db.keywordsCache.size).Equal(123360)
		)

		const os = new OrionSearch(db)

		eye.test("Search", "node",
			$ => {
				const start = process.hrtime()
				const query = new OSQuery("Donald Trump")

				let out = []
				os.perform(query, os.OSSearchType.normal, record => {
					out.push(record)
				})
				const end = process.hrtime(start);
				const time = Math.round((end[0] * 1000) + (end[1] / 1000000))
				console.log(`Found: ${out.length} records in ${time} ms`)
				return $(time).isSmaller(750) // 750 ms
			}
		)
	})
})
