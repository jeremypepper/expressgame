// string.js string utils

var String = new (function () {
  var _UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  
	this.format = function() {
	 var args = arguments;
	   return args[0].replace(/{(\d+)}/g, function(match, number) { 
	   	number = parseInt(number,10) + 1;
	     return typeof args[number] != 'undefined'
	       ? args[number]
	       : match
	     ;
	   });
	};

	
  // From Math.uuid.js, http://www.broofa.com/Tools/Math.uuid.js
  // Robert Kieffer (robert@broofa.com), MIT license
  this.uuid = function (len, rad) {
    var chars = _UUID_CHARS
      , uuid = []
      , radix = rad || chars.length
      , r;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    }
    else {
      // rfc4122, version 4 form

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };
})();
exports.String = String;