'use strict';

var User = require('../models/user');

var UserLibrary = function() {
    return {
        addUsers: function() { //add two users
            var u1 = new User({
                name: 'Administrator',
                login: 'dirvil',
                password: 'kraken',
                role: 'admin',
                hidden: true
            });

            //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
            u1.save();
        },
        serialize: function(user, done) {
            done(null, user.id);
        },
        deserialize: function(id, done) {
            User.findOne({
                _id: id
            }, function(err, user) {
                done(null, user);
            });
        }
    };
};

module.exports = UserLibrary;
