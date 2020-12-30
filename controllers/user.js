var async = require('async');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var User = require('../models/User');

function generateToken(user) {
  var payload = {
    iss: 'my.domain.com', // needs to be updated
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(365, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};
/**
 * POST /login
 * Sign in with email and password
 */
exports.loginPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });
  var errors = req.validationErrors();
  
  if (errors) {
    return res.status(400).send(errors);
  }

  new User({ email: req.body.email })
    .fetch()
      .then(function(user) {
        if (!user) {
          return res.status(401).send({ error: 'The email address ' + req.body.email + ' is not associated with any account. ' +
          'Double-check your email address and try again.'
          });
        }

        user.comparePassword(req.body.password, function(err, isMatch) {
          if (!isMatch) {
            return res.status(401).send({ error: 'Invalid email or password' });
          }
          res.send(user.toJSON());
        });
      })
      .catch(function(err) {
        return res.status(400).send({ error: 'The email address you have entered does not exist.' });
      });
};

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save()
    .then(function(user) {
        return res.send(user.toJSON());
    })
    .catch(function(err) {
      if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
        return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
      }
    });
};


/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = function(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var user = new User({ id: req.user.id });
  if ('password' in req.body) {
    user.save({ password: req.body.password }, { patch: true });
  } else {
    user.save({
      email: req.body.email,
      name: req.body.name,
      gender: req.body.gender,
      location: req.body.location,
      website: req.body.website
    }, { patch: true });
  }
  user.fetch().then(function(user) {
    if ('password' in req.body) {
      res.send({ msg: 'Your password has been changed.' });
    } else {
      res.send({ user: user, msg: 'Your profile information has been updated.' });
    }
    res.redirect('/account');
  }).catch(function(err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
    }
  });
};
