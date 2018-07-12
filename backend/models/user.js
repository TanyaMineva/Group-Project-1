const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // We can add plugins on the Schema

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, trim:true},  // unique doesn't validate the email, doesn't throw an error
  password: { type: String, required: true },
  passwordConf:{ type: String, required: true },
  adresse: {type: String, required: true},
  tel: {type: String, required: false},
  name: {type: String, required: true}
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
