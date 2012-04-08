// controllerUtil
// common controler methods
geddy = global.geddy;
var ControllerUtil = new (function () {
    this.verifyGetUser = function (req, resp, done) {
        var fbtoken = req.cookies.fbauth;
        var fbid = req.cookies.fbid;
        var user;
        if (fbtoken) {
            geddy.model.User.load(fbid, fbtoken, function (user) {
                done(user);
            });
        }
        else {
            done();
        }
    }
})();

exports.ControllerUtil = ControllerUtil;