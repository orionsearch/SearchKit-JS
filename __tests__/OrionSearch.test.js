const {
	OSDatabase,
	OSRecord,
	OSQuery,
	OrionSearch
} = require(__testDir + "../index.js")

eye.describe("Data management", () => {
	eye.test("Filters", "node",
		$ => {
			const db = new OSDatabase()
			const os = new OrionSearch(db, ["users"])
			return $(os.filters).Equal(["users"])
		},
		$ => {
			const db = new OSDatabase()
			const os = new OrionSearch(db, ["users"])
			os.add("author", "date")
			return $(os.filters).Equal(["users", "author", "date"])
		}
	)
})
eye.describe("Quick search", () => {
	eye.test("Keys", "node",
		$ => {
			const db = new OSDatabase()
			const os = new OrionSearch(db)
			const query = new OSQuery("random text", "en", ["title", "content"])
			const quick = os.perform(query, os.OSSearchType.quick, () => {})
			return $(quick._getKeys()).Equal(["title", "content"])
		}
	)
	eye.test("Search", "node",
		$ => {
			const db = new OSDatabase()
			db._data = [
				new OSRecord({
					title: "Hello World",
					author: "Me"
				}),
				new OSRecord({
					title: "How are you",
					author: "you"
				}),
				new OSRecord({
					title: "Random titles",
					author: "someone"
				}),
				new OSRecord({
					title: "Just for test",
					author: "someone else"
				})
			]
			const os = new OrionSearch(db)
			const query = new OSQuery("random test", "en", ["title", "author"])

			let out = []

			const quick = os.perform(query, os.OSSearchType.quick, record => {
				out.push(record.data.title)
			})

			return $(out).Equal(["Random titles"])
		}
	)
})

eye.describe("Normal Search", () => {
	eye.test("Keywords", "node",
		$ => {
			const db = new OSDatabase()
			db._data = [
				new OSRecord({
					title: "Hello World",
					author: "Me"
				}),
				new OSRecord({
					title: "How are you",
					author: "you"
				}),
				new OSRecord({
					title: "Random titles",
					author: "someone"
				}),
				new OSRecord({
					title: "Just for test",
					author: "someone else"
				})
			]
			db.configure("title")

			const os = new OrionSearch(db)

			const query = new OSQuery("rand test", "en", ["title", "author"])

			let out = []

			const normal = os.perform(query, os.OSSearchType.normal, record => {
				out.push(record.data.title)
			})

			return $(normal.getKeywords()).Equal(["random"])
		}
	)
	eye.test("Search", "node",
		$ => {
			const db = new OSDatabase()
			db._data = [
				new OSRecord({
					title: "Hello World",
					author: "Me"
				}),
				new OSRecord({
					title: "How are you",
					author: "you"
				}),
				new OSRecord({
					title: "Random titles",
					author: "someone"
				}),
				new OSRecord({
					title: "Just for test",
					author: "someone else"
				})
			]
			db.configure("title", "author")

			const os = new OrionSearch(db)

			const query = new OSQuery("World by someone else", "en")

			let out = []

			const normal = os.perform(query, os.OSSearchType.normal, record => {
				out.push(record.data.title)
			})

			return $(out).Equal(["Just for test", "Random titles", "Hello World"])
		}
	)
})
