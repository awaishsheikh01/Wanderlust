const User = require('../models/user');
module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    console.log(registeredUser);

    //after signup automatically log in
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next();
      }
      req.flash('success', 'Welcome to Wanderlust!');
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.login = async (req, res, next) => {
  try {
    console.log('[LOGIN] req.body:', req.body);
    const { username, password } = req.body;

    // User.authenticate() returns a function (username, password, cb)
    const authenticate = User.authenticate();

    authenticate(username, password, (err, user, reason) => {
      console.log('[LOGIN] authenticate callback:', {
        err: !!err,
        user: !!user,
        reason,
      });

      if (err) {
        console.error('[LOGIN] authenticate error:', err);
        return next(err);
      }

      if (!user) {
        // reason may be a message or object depending on version
        const msg =
          (reason && reason.message) ||
          reason ||
          'Invalid username or password';
        req.flash('error', msg);
        console.log('[LOGIN] auth failed:', msg);
        return res.redirect('/login');
      }

      // if user exists, manually create session
      req.logIn(user, (err) => {
        if (err) {
          console.error('[LOGIN] req.logIn error:', err);
          return next(err);
        }
        req.flash('success', 'Welcome back!');
        const redirectUrl = req.session.returnTo || '/listings';
        delete req.session.returnTo;
        console.log('[LOGIN] success, redirecting to:', redirectUrl);
        return res.redirect(redirectUrl);
      });
    });
  } catch (ex) {
    console.error('[LOGIN] unexpected error:', ex);
    return next(ex);
  }
};

// async (req, res) => {
//   req.flash('success', 'Welcome back to Wanderlust!');
//   let redirectUrl = res.locals.redirectUrl || '/listings';
//   res.redirect(redirectUrl);
// };

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next();
    }
    req.flash('success', 'you are logged out!');
    res.redirect('/listings');
  });
};
