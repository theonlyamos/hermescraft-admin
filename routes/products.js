var express = require('express');
var path = require('path');
var fs = require('fs');
var Category = require('../models/category.js');
var Product = require('../models/product');
var ProductImage = require('../models/product-image');
const {stripeSecretKey} = require('../config');
const Stripe = require('stripe')(stripeSecretKey);
const { PageLink } = require("../models/page");
var router = express.Router();

const { hermescraftUrl } = require('../config');

router.
route('/')
.get(async(req, res, next)=>{
  let view = req.query.view
  if (view){
    req.session.products_view = view
  }
  else if (!req.session.products_view) {
    req.session.products_view = 'grid'
  }
  let result;
  let category = req.query.category
  let page = req.query.page ? req.query.page : 1

  if (req.session.products_view === 'table'){
    result = await Product.paginate({}, {populate: 'images'})
    //products = await Product.find({}).populate('images').limit(20).exec();
  }
  else {
    if (!category || category == 'all'){
      result = await Product.paginate({}, {page: page, limit: 10, populate: 'images'})
      //products = await Product.find({}).populate('images').limit(20).exec();
    }
    else {
      result = await Product.paginate({category: category}, {page: page, limit: 10, populate: 'images'})
      //products = await Product.find({category: category}).populate('images').limit(20).exec();
    }
  }

  const products = result.docs
  const totalDocs = result.totalDocs
  const pagingCounter = result.pagingCounter
  const totalPages = result.totalPages
  const limit = result.limit
  const currentPage = result.page

  const categories = await Category.find({}).populate('image')
                                  .exec().catch((error)=>console.log(error))
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec().catch((error)=>console.log(error))
    category.link = link
    categories[i] = category
  }
  const message = req.session.message
  req.session.message = ""
  res.render('products', { title: 'HermesCraft || Products',
                        categories,
                        products,
                        totalDocs,
                        pagingCounter,
                        totalPages,
                        limit,
                        currentPage,
                        view: req.session.products_view,
                        hermescraftUrl,
                        message: message,
                        user: req.user
  });
})

router.
route('/add')
.get(async(req, res, next)=>{
  const categories = await Category.find({}).populate('image')
                                  .exec().catch((error)=>console.log(error))
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec().catch((error)=>console.log(error))
    category.link = link
    categories[i] = category
  }
  const error = req.session.error
  const errMsg = req.session.errMsg
  delete(req.session.error)
  delete(req.session.errMsg)
  res.render('add_product', { title: 'HermesCraft || Add Product',
                                    categories: categories,
                                    error, errMsg, hermescraftUrl,
                              user: req.user
  });
}).
post(async(req, res, next)=>{
  try {
    if (req.files){
      const imageFiles = req.files.images
      if (Array.isArray(imageFiles)){
        let images = []
        let imagePaths = []
        for(let i = 0; i< imageFiles.length; i++){
          let imageName = imageFiles[i].name
          imageName = req.body.name + "_"+ i + "." + imageName.split(".")[imageName.split(".").length - 1]
          const err = await imageFiles[i].mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', 'products', imageName))
          if (err){
            console.log(err)
            req.error = true
            req.errMsg = "Image upload unsuccessful"
            res.redirect('/products/add')
          }
          var image = await ProductImage.create({
            name: imageName,
            path: `/images/products/${imageName}`
          }).catch((error)=> {
            console.log(error)
          })
          images.push(image._id)
          imagePaths.push(`${hermescraftUrl}${image.path}`)
        }
  
        const product = new Product({
          name: req.body.name,
          category: req.body.category,
         // images: req.files ? Array.isArray(req.files.images) ? req.files.images.map((image,i)=>image.name) : [req.files.images.name] : [],
          images: images,
          price: parseFloat(req.body.price),
          description: req.body.description,
          size: req.body.size ? req.body.size : '',
          color: req.body.color ? req.body.color : '',
          weight: req.body.height ? req.body.weight : '',
          width: req.body.width ? req.body.width : '',
          height: req.body.height ? req.body.height : '',
          featured: req.body.featured ? req.body.featured : false,
        })
        let doc = awaitProduct.create(product)
        const stripe_product = await Stripe.products.create({
          name: doc.name,
          images: imagePaths
        })
        const stripe_price = await Stripe.prices.create({
          currency: 'usd',
          unit_amount: parseFloat(req.body.price)*100,
          product: stripe_product.id
        })
        doc.stripe_id = stripe_product.id
        doc.stripe_price_id = stripe_price.id
        doc = await doc.save()
        req.session.message = `${doc.name} added successfully!`
        return res.redirect('/products')
      }
      else {

        let imageName = imageFiles.name
        imageName = req.body.name+ "." + imageName.split(".")[imageName.split(".").length - 1]
        const err = await imageFiles.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', 'products', imageName))
          if (err){
            console.log(err)
            req.error = true
            req.errMsg = "Image upload unsuccessful"
            res.redirect('/products/add')
          }
          var image = await ProductImage.create({
            name: imageName,
            path: `/images/products/${imageName}`
          })

          const product = new Product({
            name: req.body.name,
            category: req.body.category,
            // images: req.files ? Array.isArray(req.files.images) ? req.files.images.map((image,i)=>image.name) : [req.files.images.name] : [],
            images: [image._id],
            price: parseFloat(req.body.price),
            description: req.body.description,
            size: req.body.size ? req.body.size : '',
            color: req.body.color ? req.body.color : '',
            weight: req.body.height ? req.body.weight : '',
            width: req.body.width ? req.body.width : '',
            height: req.body.height ? req.body.height : '',
            featured: req.body.featured ? req.body.featured : false,
          })
        
          let doc = await Product.create(product)
          const stripe_product = await Stripe.products.create({
            name: doc.name,
            images: [`${hermescraftUrl}${image.path}`],
            type: 'good',
            url: `${hermescraftUrl}shop/product/${doc._id}`
          })

          const stripe_price = await Stripe.prices.create({
            currency: 'usd',
            unit_amount: parseFloat(req.body.price)*100,
            product: stripe_product.id
          })
          doc.stripe_id = stripe_product.id
          doc.stripe_price_id = stripe_price.id
          doc = await doc.save()
          req.session.message = `${doc.name} added successfully!`
          return res.redirect('/products')
      }
    }
    else {
      req.session.error = true
      req.session.errMsg = "Select product image to upload"
      return res.redirect('/products/add')
    }
  } 
  catch (error) {
    console.log(error)
    req.session.error = true
    req.session.errMsg = "Select product image to upload"
    return res.redirect('/products/add')
  }
})

router.
route('/:productId')
.get(async(req, res, next)=>{
  const prodId = req.params.productId
  const newdoc = await Product.findById(prodId).populate('images').exec(); 
  const categories = await Category.find({}).populate('image')
                                  .exec().catch((error)=>console.log(error))
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec().catch((error)=>console.log(error))
    category.link = link
    categories[i] = category
  }
  return res.render('product', {title: `Product - ${newdoc.name}`,
                                      product: newdoc,
                                      categories: categories,
                                      hermescraftUrl,
                                      user: req.user
                    })
})

router.
route('/delete/:productId')
.get(async(req, res, next)=>{
  const prodId = req.params.productId
  const doc = await Product.findByIdAndRemove(prodId).populate('images').exec().catch((error)=>console.log(error))
  Array.prototype.forEach.call(doc.images, async(image, i)=>{
    fs.unlink(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', 'products', image.name), async()=>{
      await ProductImage.findByIdAndRemove(image._id).exec().catch((error)=>console.log(error))
    })
  })
  req.session.message = `${doc.name} deleted successfully!`
  return res.redirect('/products')
})

module.exports = router;
