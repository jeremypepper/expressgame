// facebook.js

var Facebook = new (function () {
    var QueryString = require("querystring")
        , ajax = require(process.cwd() + "/util/ajax").Ajax
        , string = require(process.cwd() + "/util/string").String
        , fbgraph = "https://graph.facebook.com"
        , fbgraphFormat = fbgraph + "/{0}?access_token={1}";

    function authGraphCall(path, token, cb) {
        var url = string.format(fbgraphFormat, path, token)
        ajax.get(
            url
            , function (data, res) {
                cb(JSON.parse(data));
            }
            , function () {
                console.trace("error in authgraphcall");
                cb({error:"Error calling fb"})
            }
        );
    }

    this.getMe = function (token, cb) {
        authGraphCall("me", token, cb);
    };

    this.getFriends = function (token, cb) {
        authGraphCall("friends", token, cb);
    }

    this.getServerAuthUrl = function (clientid, redirecturi, fbstate) {
        return string.format("https://www.facebook.com/dialog/oauth?client_id={0}&redirect_uri={1}&state={2}"
            , clientid
            , redirecturi
            , fbstate
        );
    }

    this.getServerAccessTokenUrl = function (redirectPath, code, callback) {
        // todo, these configs should be passed in
        var redirecturi = "http://" + global.config.FB.host + redirectPath
        var fbtokenpath = fbgraph + "/oauth/access_token?"
            + "client_id=" + global.config.FB.appid
            + "&redirect_uri=" + encodeURIComponent(redirecturi)
            + "&client_secret=" + global.config.FB.secret
            + "&code=" + code;

        function done(data, res) {
            data = data ? data : null;
            callback(data);
        }

        ajax.get(
            fbtokenpath,
            done,
            done
        );
    }
})();

exports.Facebook = Facebook;