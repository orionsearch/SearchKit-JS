const {
	OSDatabase,
	OSQuery,
	OSRecord
} = require("../includes.jss")

class OSQuick {
	constructor(query, completion) {
		this.query = query
		this.callback = completion
	}
}

module.exports = OSQuick;
