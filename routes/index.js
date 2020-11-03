var express = require('express');
var Category = require('../models/category.js');
var Product = require('../models/product');
const { PageLink } = require("../models/page");
var router = express.Router();

const { hermescraftUrl } = require('../config');

/* GET Admin page. */
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
  const products = await Product.find({}).populate('images').limit(8).exec();
  res.render('index', { title: 'HermesCraft || Admin',
                        categories: categories,
                        products: products,
                        hermescraftUrl
  });
});

router.get('/logout', async (req, res, next) => {
  req.session.destroy();
  res.clearCookie();
  res.redirect('/login')
});

module.exports = router;
