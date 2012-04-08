// Use these as static functions! Models grabbed from the DB do not have these functions
var User = new ( function () {
    geddy = global.geddy;
    this.save = function (user) {
        user.saved = true;
        Database.SaveUser(user);
    };
    this.load = function (id, token, callback) {
        Database.LoadUser(id, token, callback);
    };
    this.loadAll = function (callback) {
        Database.LoadAllUsers(callback);
    };
} )();
exports.User = User;