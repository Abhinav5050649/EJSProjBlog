const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'food123'
const User = require('../models/user')

// Configure Passport.js with the JWT strategy
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, (jwtPayload, done) => {
    const user1 = User.findById(jwtPayload.sub);
    if (!user1) {
        return done(null, false);
    }
  //done(null, jwtPayload.user); // Assuming the user information is stored in jwtPayload.user
  done(null, user1)
}));

const fetchUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(401).send({ error: 'Faulty Authentication' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = fetchUser;

/*
var authToken = ""
// Configure Passport.js with the JWT strategy
passport.use(new JWTStrategy({
    //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromHeader('authToken'),
        ExtractJwt.fromUrlQueryParameter('authToken'),
        ExtractJwt.fromBodyField('authToken')
      ]),
    secretOrKey: JWT_SECRET
    }, (jwtPayload, done) => {
        const user1 = User.findById(jwtPayload.sub);
        if (!user1) {
            return done(null, false);
        }
    //done(null, jwtPayload.user); // Assuming the user information is stored in jwtPayload.user
    done(null, user1)
}));

const addToken = (req, res, next) => {
    req.headers("authToken") = authToken
    next()
}

const fetchUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
        return res.status(500).send({ error: 'Internal Server Error' });
        }

        if (!user) {
        return res.status(401).send({ error: 'Faulty Authentication' });
        }

        req.user = user;
        next();
    })(req, res, next);
};
*/