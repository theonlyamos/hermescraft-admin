const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserImageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    path: String
},{timestamps: true})

module.exports = mongoose.model('UserImage', UserImageSchema);
