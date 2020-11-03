const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

mongoosePaginate.paginate.options = {
  limit: 10
}

const Product = new Schema({
    name: {type: String, required: true},
    stripe_id: {type: String},
    stripe_price_id: {type: String},
    category: {type: String},
    images: [{type: Schema.Types.ObjectId, ref: 'ProductImage'}],
    price: {type: String, required: true},
    description: {type: String, required: true},
    size: {type: String},
    brank: {type: String},
    color: {type: String},
    weight: {type: String},
    width: {type: String},
    height: {type: String},
    featured: {type: Boolean, default: false},
    topRated: {type: Boolean, default: false}
},{timestamps: true});

Product.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', Product);
