const mongoose = require('mongoose')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/keys')
require('../models/user')
const Users = mongoose.model('user')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrToken;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        let { id } = jwt_payload
        Users.findById({ _id: id })
            .then(user => {
                if (user) {
                    return done(null, user)
                }
                return done(null, false)
            })
            .catch(err => console.log(err))
    }));
}