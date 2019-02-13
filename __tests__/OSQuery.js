const {OSQuery} = require(__testDir + "../index.js")
eye.describe("Parsing", () => {
	const str = "How tall is eiffel tower? tag:paris"
	const query = new OSQuery(str)
	eye.test("Filters", "node",
		$ => $(query.parsed.filters).Equal([["tag", "paris"]])
	)
	eye.test("Keywords", "node",
		$ => $(query.parsed.keywords).Equal({
			"tall": 1 / 3,
			"eiffel": 1 / 3,
			"tower": 1 / 3
		})
	)
})
