var ajax = require("../util/ajax").Ajax;
var util  = require('util'),
spawn = require('child_process').spawn,
cmd    = spawn('node', ['app.js'], {cwd:".."});
console.log("started process with pid:" + cmd.pid)

var cmdHasExited;
var cmdHasStarted;
var checkServerTests = 2;

cmd.stdout.on('data', function (data) {
  	console.log(data.toString().replace("\n?\n$",""));
  	var match = data.toString().match("Express server listening on port 80");
  	if(match)
  	{
		cmdHasStarted = true;
	}
});

cmd.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString().replace("\n?\n$","") );
});

cmd.on('exit', function (code) {
	cmdHasExited = true;
  	console.error('child process exited with code ' + code);
});

function checkIsServerRunning(test){
	console.log("checkis server running "+ cmdHasStarted)
	test.ok(cmdHasStarted, "child process started");
	test.ok(!cmdHasExited, "child process exited");
}

exports.testStartup = function(test){
	console.log("teststartup server running")
	setTimeout(function(){
		checkIsServerRunning(test);
		test.done();
	},3000);
}

exports.testIndex = function(test){
    test.expect(1 + checkServerTests);
    checkIsServerRunning(test);
    ajax.get(
    	"http://localhost",
    	function (text,resp) {
    		test.ok(text.match("Welcome, you should totally log in, it will be fun."), "html was unexpected");
    	},
    	function (text) {
    		ok(false, "error calling url");
    	},
    	function(text, resp){
    		test.done();
    	}
    );
};


exports.cleanUpTest = function(test){
	cmd.kill();
	cmd.kill();
	test.ok(true,"tried to kill process")
	test.done();
}