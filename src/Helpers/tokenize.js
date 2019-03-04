const stopwords = require('stopwords-iso');


function tokenize(text, lang="en") {
	const stops = stopwords[lang]
	const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") // lower case and remove accents
	const tokens = t.replace(/[^\w\d\s]/g, "")
		.replace(/\s{2,}/g, " ")
		.split(" ")
	let out = tokens.filter(str => !stops.includes(str) && str != "")
	if (out.length != 0) {
		return out
	}
	return tokens.filter(a => a != "")
}

module.exports = tokenize
