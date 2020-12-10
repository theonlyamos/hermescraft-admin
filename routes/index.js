var express = require('express');
var Category = require('../models/category.js');
var Product = require('../models/product');
const debug = require('../debugger');
const User = require("../models/user");
const Order = require('../models/order');
const { PageLink } = require("../models/page");
var router = express.Router();

const { hermescraftUrl, hermescraftAdminUrl } = require('../config');

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
  const ordersAggregate = await Order.aggregate([{$group: {_id: null, ordersTotal: {$sum: "$total"}}}])
  const ordersTotal = ordersAggregate.length ? ordersAggregate[0].ordersTotal : 0
  const ordersCount = await Order.countDocuments({})
  let result = await Order.paginate({}, {limit: 15, sort: {createdAt: -1}})
  const latestOrders = result.docs;
  const customersCount = await User.countDocuments({role: 'customer'});
  result = await User.paginate({role: 'customer'}, {limit: 15, sort: {createdAt: -1}});
  const newCustomers = result.docs;
  const productsCount = await Product.countDocuments({});
  res.render('index', { title: 'HermesCraft || Admin',
                        categories: categories,
                        products: products,
                        hermescraftUrl, hermescraftAdminUrl,
                        ordersCount, latestOrders,
                        ordersTotal, customersCount,
                        newCustomers, productsCount,
                        user: req.user
  });
});

router.get('/logout', async (req, res, next) => {
  debug.log(`[Admin Logout] ${req.user.username}: ${new Date()}`)
  req.session.destroy();
  res.clearCookie();
  res.redirect('/login')
});

module.exports = router;
