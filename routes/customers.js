var express = require('express');
const path = require("path");
const debug = require('../debugger');
const User = require("../models/user");
const UserImage = require('../models/user-image');
var Order = require('../models/order');
const {stripeSecretKey} = require('../config');
const stripe = require('stripe')(stripeSecretKey);

const { hermescraftUrl, hermescraftAdminUrl } = require('../config');

const router = express.Router();
router.use(express.json())

router
.route('/')
.get(async(req, res, next)=>{
  try {
    let page = req.query.page ? req.query.page : 1
    const result = await User.paginate({role: "customer"}, {page: page, limit: 10, populate: "image"})
    const customers = result.docs

    for (let i = 0; i < customers.length; i++){
      customers[i].orders = await Order.countDocuments({user: customers[i]._id})
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

    res.render('customers', { title: 'HermesCraft || Customers',
                          customers, totalDocs, pagingCounter,
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

router.
route('/update').
get(async function(req, res, next) {
  try {
    action = req.query.action
    if (action === 'delete'){
      const customer = await User.findOneAndRemove({_id: req.query.customer});

      req.session.message = "Customer Account deleted successfully!"

      if (customer._id === req.user._id){
        req.session.error = true;
        req.session.errMsg = "Customer Account deleted successfully!"
        return res.redirect('/logout')
      }
    }
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = "Error updating account info"
  }

  res.redirect('/customers')
})

router.
route('/:customer').
get(async function(req, res, next) {
  try {
    let customer = await User.findById(req.params.customer).populate('image')
    customer.orders = await Order.countDocuments({user: customer._id})
    const message = req.session.message
    const error = req.session.error
    const errMsg = req.session.errMsg

    req.session.message = ""
    req.session.error = false
    req.session.errMsg = ""
    res.render('customer', { title: 'HermesCraft || Account',
                          hermescraftUrl, hermescraftAdminUrl,
                          user: req.use, message, error, errMsg,
                          customer
    });
  } 
  catch (error) {
    debug.error(error)
    res.redirect('/customers')
  }
})
.post(async(req, res, next)=>{
  try {
    const customer = await User.findOneAndUpdate({_id: req.params.customer}, req.body)
    req.session.message = 'Account info updated successfully'
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = "Error updating account info"
  }

  res.redirect('/customers')
})

router.
route('/upload').
post(async(req, res, next)=>{
  try {
    let imageFile = req.files.image
    let imageName = imageFile.name
    imageName = req.body.account+ "." + imageName.split(".")[imageName.split(".").length - 1]
    const err = await imageFile.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', 'users', imageName))
    if (err){
      debug.error(err)
      req.error = true
      req.errMsg = "Image upload unsuccessful"

      return res.redirect('/customers')
    }

    const image = await UserImage.create(new UserImage({
      user: req.body.account,
      name: imageName,
      path: `/images/users/${imageName}`
    }))

    const customer = await User.findOneAndUpdate({_id: req.body.account}, {image: image._id})
      
    req.session.message = "Account Image updated successfully"
  } 
  catch (error) {
    debug.error(error)
    req.error = true
    req.errMsg = "Image upload unsuccessful"
  }

  res.redirect('/customers')
})

module.exports = router;
