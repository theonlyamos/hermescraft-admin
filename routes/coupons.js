var express = require('express');
var Category = require('../models/category.js');
var Product = require('../models/product');
const debug = require('../debugger');
const User = require("../models/user");
const Order = require('../models/order');
//const Couponse = require('../models/coupon');
const { PageLink } = require("../models/page");
var router = express.Router();

const { hermescraftUrl, hermescraftAdminUrl } = require('../config');

router.
route('/').
get(async function(req, res, next) {
  const categories = await Category.find({}).populate('image')
                                  .exec().catch((error)=>console.log(error))
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec().catch((error)=>console.log(error))
    category.link = link
    categories[i] = category
  }
  res.render('coupons', { title: 'HermesCraft || Coupons',
                        categories: categories,
                        user: req.user
  });
});

module.exports = router;
