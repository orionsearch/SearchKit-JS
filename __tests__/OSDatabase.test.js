const {
	OSDatabase,
	OSRecord
} = require(__testDir + "../index.js")

eye.describe("Configure", () => {
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
	eye.test("Keywords & Cache", "node",
		$ => $([...db.keywordsCache]).Equal([
			'hello',
			'world',
			'how',
			'are',
			'you',
			'random',
			'titles',
			'just',
			'for',
			'test'
		]),
		$ => $([...db._data[0].data.keywords]).Equal(["hello", "world"])
	)
	eye.test("Select", "node",
		$ => $(db.select("world")[0].data.title).Equal("Hello World"),
		$ => $(db.select("you", "author")[0].data.title).Equal("How are you")
	)
	eye.test("Add", "node",
		$ => {
			db.add([
				new OSRecord({
					title: "Let's add some content",
					author: "Unknown"
				})
			], "title")
			return $(db.keywordsCache.has("content")).Equal(true)
		}
	)
})
