var express = require('express');
const path = require("path");
const debug = require('../debugger');
const User = require("../models/user");
const UserImage = require('../models/user-image');
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
    const result = await User.paginate({role: "administrator"}, {page: page, limit: 10, populate: 'image'})
    
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

    const user = await User.findById(req.user._id).populate('image')
    res.render('administrators', { title: 'HermesCraft || Administrators',
                          hermescraftUrl, message, administrators,
                          msgTitle, error, errMsg, totalDocs,
													pagingCounter, totalPages, limit, currentPage,
                          user

    })
  }
  catch(error){
    debug.error(error)
    res.json({status: 'error', error: error });

  }
})

router.
route('/update').
get(async function(req, res, next) {
  try {
    action = req.query.action
    if (action === 'delete'){
      const administrator = await User.findOneAndRemove({_id: req.query.administrator});

      req.session.message = "Admin Account deleted successfully!"

      if (administrator._id === req.user._id){
        req.session.error = true;
        req.session.errMsg = "Admin Account deleted successfully!"
        return res.redirect('/logout')
      }
    }
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = "Error updating account info"
  }

  res.redirect('/administrators')
})

router.
route('/:administrator').
get(async function(req, res, next) {
  try {
    const administrator = await User.findById(req.params.administrator).populate('image')

    const message = req.session.message
    const error = req.session.error
    const errMsg = req.session.errMsg

    req.session.message = ""
    req.session.error = false
    req.session.errMsg = ""

    const user = await User.findById(req.user._id).populate('image')
    res.render('administrator', { title: 'HermesCraft || Account',
                          hermescraftUrl, hermescraftAdminUrl,
                          user, message, error, errMsg,
                          administrator
    });
  } 
  catch (error) {
    debug.error(error)
    res.redirect('/administrators')
  }
})
.post(async(req, res, next)=>{
  try {
    const administrator = await User.findOneAndUpdate({_id: req.params.administrator}, req.body)
    req.session.message = 'Account info updated successfully'
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = "Error updating account info"
  }

  res.redirect('/administrators')
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

      return res.redirect('/administrators')
    }

    const image = await UserImage.create(new UserImage({
      user: req.body.account,
      name: imageName,
      path: `/images/users/${imageName}`
    }))

    const administrator = await User.findOneAndUpdate({_id: req.body.account}, {image: image._id})

    if (administrator._id === req.user._id){
      req.user = administrator
    }
      
    req.session.message = "Account Image updated successfully"
  } 
  catch (error) {
    debug.error(error)
    req.error = true
    req.errMsg = "Image upload unsuccessful"
  }

  res.redirect('/administrators')
})


module.exports = router;
