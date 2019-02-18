const {
	OSDatabase,
	OSRecord,
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
