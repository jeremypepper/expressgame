// ajax.js
var Ajax = {};
(function () {
    var http = require("http");
    var https = require("https");
    var Url = require("url");
    var log = (global.geddy && global.geddy.log) ? global.geddy.log : console;
    log.info("fcn start");
    Ajax.get = function (url, successcb, failcb, finallycb) {
        var data = [];
        var success;
        var resp;
        var done = function () {
            if (success) {
                if (successcb) successcb(resp, data.join());
            }
            else {
                log.error("error in ajax.js: url:" + url)
                if (failcb)failcb(data);
            }

            if (finallycb)finallycb();
        };

        parsedUrl = Url.parse(url);

        if (parsedUrl.protocol == "http:") {
            scheme = http;
            if (!parsedUrl.port)parsedUrl.port = 80;
        }
        else if (parsedUrl.protocol == "https:") {
            scheme = https;
            if (!parsedUrl.port)parsedUrl.port = 443;
        }
        else {
            //todo add more schemetypes
            log.error("errror: unsupported protocol in ajax.js");
            done();
        }


        var options = {
            host:parsedUrl.hostname,
            port:parsedUrl.port,
            path:parsedUrl.path
        };

        scheme.get(options,
            function (res) {
                resp = res;
                success = res.statusCode == 200;
                res.on("data", function (chunk) {
                    data.push(chunk)
                });
                res.on("close", function () {
                    done();
                });
                res.on("end", function () {
                    if (!success) {
                        log.error(resp.statuscode + " error calling url " + url)
                        log.error(data.join())
                    }
                    done();
                });
            }).on("error", function () {
                log.error("error seting up ajax get")
                done()
            });
    };
})();
exports.Ajax = Ajax;