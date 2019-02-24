const stopwords = require('stopwords-iso');


function tokenize(text, lang="en") {
	const stops = stopwords[lang]
	const t = text.toLowerCase()
	const tokens = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "")
		.replace(/\s{2,}/g, " ")
		.split(" ")
	let out = []
	tokens.forEach(str => {
		if (!stops.includes(str) && str != "") {
			out.push(str)
		}
	})
	if (out.length != 0) {
		return out
	}
	return tokens.filter(a => a != "")
}

module.exports = tokenize
