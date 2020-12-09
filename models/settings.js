const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SiteContactSchema = new Schema({
    type: {type: String, enum: ['email', 'phone']},
    url: {type: String},
    text: {type: String}
},{timestamps: true})

const SiteInfoSchema = new Schema({
    name: {type: String},
    url: {type: String},
    favicon: {type: Schema.Types.ObjectId, ref: 'PageImage'},
    logo: {type: Schema.Types.ObjectId, ref: 'PageImage'},
    description: {type: String},
    contacts: [{type: Schema.Types.ObjectId, ref: 'SiteContact'}]
});

module.exports = {
    SiteInfo: mongoose.model('SiteInfo', SiteInfoSchema),
    SiteContact: mongoose.model('SiteContact', SiteContactSchema)
}
