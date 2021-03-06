const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  imagepath: { type: String, required: true},
  name: { type: String, required: true },
  website: { type: String, required: true},
  number: { type: String, required: true},
  workfield: { type: String, required: true},
  services: { type: String, required: true},
  year: { type: String, required: true},
  location: { type: String, required: true },
  creator: { type:mongoose.Schema.Types.ObjectId, ref:"User", required: true}
})

module.exports = mongoose.model('Profile', profileSchema);
