// wordlist.js

// words.js

var WordList = function (words) {
    var self = this;
    this.words = words;
    function getWord() {
        var index = Math.floor(Math.random() * self.words.length);
        return self.words[index];
    }

    ;

    return {
        "getWord":getWord
    };
};

exports.WordList = WordList;