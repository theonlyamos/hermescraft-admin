const passport = require('passport-local-mongoose');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

mongoosePaginate.paginate.options = {
  limit: 12
}

const User = new Schema({
  username: {type: String, required: true},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  country: {type: String},
  phone: {type: String, required: true},
  email_verified: {type: Boolean, default: false},
  stripe_id: {type: String},
  role: {type: String, enum: ['customer', 'administrator'], default: 'customer'}
},{timestamps: true});

User.plugin(passport);
User.plugin(mongoosePaginate)

module.exports = mongoose.model('User', User);
