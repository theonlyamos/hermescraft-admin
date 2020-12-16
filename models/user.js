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
  phone: {type: String, required: true},
  email_verified: {type: Boolean, default: false},
  stripe_id: {type: String},
  role: {type: String, enum: ['customer', 'administrator'], default: 'customer'},
  image: {type: Schema.Types.ObjectId, ref: 'UserImage'},
  position: {type: String},
  occupation: {type: String},
  state: {type: String},
  address: {type: String},
  city: {type: String},
  postal: {type: String},
  facebook: {type: String},
  twitter: {type: String},
  linkedin: {type: String},
  instagram: {type: String},
  github: {type: String},
},{timestamps: true});

User.plugin(passport);
User.plugin(mongoosePaginate)

module.exports = mongoose.model('User', User);
