const { OSRecord } = require(__testDir + "../index.js")

eye.test("Data", "node",
	$ => $(new OSRecord({title: "Hello World", content: "blabla"}).keys).Equal(["title", "content"])
)
