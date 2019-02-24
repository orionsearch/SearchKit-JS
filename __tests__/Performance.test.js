const {
	OSDatabase,
	OSRecord,
	OSQuery,
	OrionSearch
} = require(__testDir + "../index.js")

eye.describe("Normal", () => {
	const data = require(__testDir + '../node_modules/better-sqlite3')(__testDir + '../../TestDB/summary_small.db');
	const db = new OSDatabase()
	db.setPlugin(
		(key, contains) => {
			let rows = []
			if (contains == null){
				const query = data.prepare(`SELECT * FROM main`)
				rows = query.all()
			} else {
				const query = data.prepare(`SELECT * FROM main WHERE ${key} LIKE "%${contains}%"`)
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
	eye.test("Configure", "node",
		$ => $(() => {
			db.configure("headlines", "text")
		}).toRun(),
		$ => $(db.keywordsCache.size).Equal(22355)
	)
})
