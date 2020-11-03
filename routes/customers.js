var express = require('express');
var Product = require('../models/product');
var Category = require('../models/category');
var User = require('../models/user');
var Order = require('../models/order');
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
    const result = await User.paginate({}, {page: page, limit: 10})
    const customers = result.docs
    console.log(customers)
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
                          msgTitle, error, errMsg

    })
  }
  catch(error){
    console.log(Object.keys(error))
    res.json({status: 'error', error: error });

  }
})
.post(async (req, res) => {
  let cart = req.session.cart
  if (!cart){
    cart = {}
  }
  let cartTotal = 0
  let line_items = []
  for (let k in cart){
    cartTotal += Number.parseFloat(cart[k].total)
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: cart[k].name,
          images: [cart[k].image]
        },
        unit_amount: parseFloat(cart[k].price)*100
      },
      quantity: cart[k].quantity
    })
  }

  const paymentOptions = {
    amount: cartTotal * 100,
    currency: 'usd',
    payment_method_types: ['card'],
    setup_future_usage: 'on_session'
  }

  const checkoutOptions = {
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: shippingAllowedCountries
    },
    allow_promotion_codes: true,
   // setup_future_usage: 'on_session',
    success_url: 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cart',
  }

  if (req.user){
      checkoutOptions.customer_email = req.user.username
      paymentOptions.receipt_email = req.user.username
  }
  const payment = await stripe.paymentIntents.create(paymentOptions)
  checkoutOptions.payment_intent = payment._id
  const session = await stripe.checkout.sessions.create(checkoutOptions)
  .catch((error)=>{
    console.log(error)
  });
  console.log(session)
  res.json({ id: session.id });
});

router.
route('/success')
.get(async(req, res, next)=>{
  req.session.msgTitle = "Order Complete"
  req.session.message = "Payment has been made successfully"
  req.session.cart = {}
  res.json({session: req.query.session_id})
  //res.redirect('/shop')
})

router.
route('/cancel')
.get(async(req, res, next)=>{
  req.session.errMsg = "Payment cancelled by user"
  res.redirect('/shop')
})


module.exports = router;
