const { OSRecord } = require(__testDir + "../index.js")
const record = new OSRecord({title: "Hello World", content: "blabla", priv: "test"})
record.main("title")
record.secondary("content")
record.private(["priv"])
eye.test("Data & Private", "node",
	$ => $(record.keys).Equal(["title", "content"]),
	$ => $(record.values).Equal(["Hello World", "blabla"])
)
eye.test("Main & Secondary", "node",
	$ => $(record.main).Equal("title"),
	$ => $(record.secondary).Equal("content")
)
