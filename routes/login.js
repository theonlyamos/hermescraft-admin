const express = require('express');
const passport = require('passport');
const debug = require('../debugger');
const Cart = require('../models/cart');
const router = express.Router();

const { hermescraftUrl } = require('../config');

router.
route('/').
get((req, res, next)=>{
    error = req.session.error
    errMsg = req.session.errMsg
    msgTitle = req.session.msgTitle
    message = req.session.message
    req.session.error = false
    req.session.errMsg = undefined
    req.session.msgTitle = undefined
    req.session.message = undefined

    res.render('login', {title: "HermesCraft || Login",
                        error, errMsg, msgTitle, message,
                        hermescraftUrl
    })
}).
post(async(req, res, next)=>{
  try {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            debug.error(err)
            return res.redirect('/login')
        }
    
        if (!user) {
            req.session.error = true
            req.session.errMsg = info.message
            return res.redirect('/login');
        }
        req.logIn(user, async function(err) {
          if (err) {
                debug.error(err)
                return res.redirect('/login')
          }
          debug.success(`[Admin Login]: ${user.username} ${new Date()}`)
          let cart = await Cart.findOne({"user": req.user._id}).exec()
          if (cart){
            req.session.cart = cart.items
          }
          else {
            cart = new Cart({
                user: req.user._id, 
                items: req.session.cart
              })
          
              await cart.save().catch((error)=>debug.log(error))
          }
          return res.redirect('/');
        });
    
    })(req, res, next);
  } 
  catch (error) {
    debug.error(error)
  }
})
module.exports = router;
