// const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
// });

// // Add passport-local-mongoose plugin to userSchema
// userSchema.plugin(passportLocalMongoose);

// // Export model
// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

// Try to require passport-local-mongoose in a way that works for both CJS and ESM interop
let passportLocalMongoose = require('passport-local-mongoose');
// handle case where the package was transpiled/packaged with a default export
if (passportLocalMongoose && passportLocalMongoose.default) {
  passportLocalMongoose = passportLocalMongoose.default;
}

if (typeof passportLocalMongoose !== 'function') {
  throw new Error(
    'passport-local-mongoose did not export a function. ' +
      'Make sure the package is installed and you are using the correct module system.'
  );
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Add plugin (creates username, hash, salt automatically)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
