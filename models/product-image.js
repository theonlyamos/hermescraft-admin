const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductImageSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product'},
    name: String,
    path: String
},{timestamps: true})

module.exports = mongoose.model('ProductImage', ProductImageSchema);
