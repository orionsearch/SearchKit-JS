class OSRecord {
	constructor(data) {
		this.data = data
		this.score = 0
	}
	main(key) {
		if (typeof this.data[key] != "undefined") {
			this.main = key
		} else {
			throw `Wrong main key: ${key}`
		}
	}
	secondary(key) {
		if (typeof this.data[key] != "undefined" && this.main != key) {
			this.secondary = key
		} else {
			throw `Wrong secondary key: ${key}`
		}
	}
	private(keys) {
		keys.forEach(key => {
			delete this.data[key]
		})
	}
	get keys() {
		return Object.keys(this.data)
	}
	get values() {
		return Object.values(this.data)
	}
}
module.exports = OSRecord;
