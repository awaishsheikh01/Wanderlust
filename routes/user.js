const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');

// signup  Use of Router.route()
router
  .route('/signup')
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

//Login
router.get('/login', userController.renderLoginForm);

// router.post(
//   '/login',
//   saveRedirectUrl,
//   passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true,
//   }),
//   userController.login
// );

// TRY FOR BEST
// POST /login - manual auth using passport-local-mongoose's authenticate()
router.post('/login', userController.login);

// logout
router.get('/logout', userController.logout);

module.exports = router;
