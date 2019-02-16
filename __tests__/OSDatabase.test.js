const { OSDatabase, OSRecord } = require(__testDir + "../index.js")

eye.describe("Configure", () => {
	const db = new OSDatabase()
	db._data = [
		new OSRecord({
			title: "Hello World"
		}),
		new OSRecord({
			title: "How are you"
		}),
		new OSRecord({
			title: "Random titles"
		}),
		new OSRecord({
			title: "Just for test"
		})
	]
	db.configure("title")
	console.log(db.keywordsCache)
	eye.test("Keywords Cache", "node",
		$ => $(db.keywordsCache).Equal(new Set(["hello", "world", "you", "random", "titles", "just", "test"]))
	)
})
