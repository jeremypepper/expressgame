// words.js
function createWord(difficulty, word)
{
	return {"word": word, "difficulty":difficulty};
}


var Words = 
	[
		createWord(1, "kitty"),
		createWord(1, "puppy"),
		createWord(3, "back to the future"),
		createWord(2, "basketball"),
		createWord(3, "dubstep"),
		createWord(2, "cry baby"),
		createWord(1, "bird"),
		createWord(2, "fireplace"),
		createWord(1, "television"),
		createWord(2, "air conditioning"),
		createWord(2, "aliens"),
		createWord(2, "hulk hogan"),
		createWord(2, "handlebars"),
		createWord(3, "donald trump"),
		createWord(3, "brad pitt"),
		createWord(3, "kayne west"),
		createWord(3, "kobe bryant"),
		createWord(3, "lebron james"),
		createWord(2, "obama"),
		createWord(2, "snowboard"),
		createWord(2, "ski"),
		createWord(3, "drama"),
		createWord(3, "iron man"),
		createWord(3, "superman"),
		createWord(2, "toilet"),
		createWord(1, "shark"),
		createWord(2, "rock n roll")
	];

exports.Words = Words;