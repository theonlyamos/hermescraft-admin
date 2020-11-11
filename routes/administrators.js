var express = require('express');
var Product = require('../models/product');
var Category = require('../models/category');
var User = require('../models/user');
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
    const result = await User.paginate({role: "administrator"}, {page: page, limit: 10})
    
		const administrators = result.docs
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

    res.render('administrators', { title: 'HermesCraft || Administrators',
                          hermescraftUrl, message, administrators,
                          msgTitle, error, errMsg, totalDocs,
													pagingCounter, totalPages, limit, currentPage,
                          user: req.user

    })
  }
  catch(error){
    console.log(error)
    res.json({status: 'error', error: error });

  }
})


module.exports = router;
