var express = require('express');
var Product = require('../models/product');
var Category = require('../models/category');
var User = require('../models/user');
var Coupon = require('../models/order');
const {stripeSecretKey} = require('../config');
const stripe = require('stripe')(stripeSecretKey);
const { hermescraftUrl } = require('../config');

const router = express.Router();
router.use(express.json())

router
.route('/')
.get(async(req, res, next)=>{
  try {
    let page = req.query.page ? req.query.page : 1
    const result = await User.paginate({role: "coupon"}, {page: page, limit: 10})
    const coupons = result.docs

    for (let i = 0; i < coupons.length; i++){
      coupons[i].orders = await Order.countDocuments({user: coupons[i]._id})
    }
    const totalDocs = result.totalDocs
    const pagingCounter = result.pagingCounter
    const totalPages = result.totalPages
    const limit = result.limit
    const currentPage = result.page

    const message = req.session.message
    const msgTitle = req.session.msgTitle
    const error = req.session.error
    const errMsg = req.session.errMsg

    req.session.message = undefined
    req.session.msgTitle = undefined
    req.session.error = undefined
    req.session.errMsg = undefined

    res.render('coupons', { title: 'HermesCraft || Customers',
                          coupons, totalDocs, pagingCounter,
                          totalPages, limit, currentPage,
                          hermescraftUrl, message, 
                          msgTitle, error, errMsg,
                          user: req.user

    })
  }
  catch(error){
    console.log(Object.keys(error))
    res.json({status: 'error', error: error });

  }
})

module.exports = router;
