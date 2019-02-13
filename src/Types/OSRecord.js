class OSRecord {
	constructor(data) {
		this.data = data
	}
	get keys() {
		return Object.keys(this.data)
	}
	get values() {
		return Object.values(this.data)
	}
}
module.exports = OSRecord;
