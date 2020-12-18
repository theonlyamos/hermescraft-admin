const express = require('express');
const path = require("path");
const debug = require('../debugger');
const User = require("../models/user");
const UserImage = require('../models/user-image');
var router = express.Router();

const { hermescraftUrl, hermescraftAdminUrl } = require('../config');

router.
route('/').
get(async function(req, res, next) {
  try {

    const message = req.session.message
    const error = req.session.error
    const errMsg = req.session.errMsg

    req.session.message = ""
    req.session.error = false
    req.session.errMsg = ""

    const user = await User.findById(req.user._id).populate('image')
    res.render('account', { title: 'HermesCraft || Account',
                          hermescraftUrl, hermescraftAdminUrl,
                          user, message, error, errMsg
    });
  } 
  catch (error) {
    debug.error(error)
    res.redirect('/')
  }
})
.post(async(req, res, next)=>{
  try {
    const user = await User.findOneAndUpdate({_id: req.user._id}, req.body)
    req.session.message = 'Account info updated successfully'
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = "Error updating account info"
  }

  res.redirect('/account')
})

router.
route('/upload').
post(async(req, res, next)=>{
  try {
    let imageFile = req.files.image
    let imageName = imageFile.name
    imageName = req.body.account+ "." + imageName.split(".")[imageName.split(".").length - 1]
    debug.log(imageName)
    const err = await imageFile.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', 'users', imageName))
    if (err){
      debug.error(err)
      req.error = true
      req.errMsg = "Image upload unsuccessful"

      return res.redirect('/account')
    }

    const image = await UserImage.create(new UserImage({
      user: req.body.account,
      name: imageName,
      path: `/images/users/${imageName}`
    }))

    const user = await User.findOneAndUpdate({_id: req.body.account}, {image: image._id})

    req.user = user
    req.session.message = "Account Image updated successfully"
  } 
  catch (error) {
    debug.error(error)
    req.error = true
    req.errMsg = "Image upload unsuccessful"
  }

  res.redirect('/account')
})

module.exports = router;
