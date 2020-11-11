var express = require('express');
var path = require('path');
var fs = require('fs');
var connectEnsureLoggedIn = require('connect-ensure-login');
var Category = require('../models/category.js');
const { Page, PageImage, PageSection, PageText, PageLink, CarouselImage, PageCarouselItem } = require('../models/page');
var router = express.Router();

const { hermescraftUrl } = require('../config');

//router.use(connectEnsureLoggedIn.ensureLoggedIn())

router.
route('/').
get(async function(req, res, next) {
  const categories = await Category.find({}).populate('image')
                                  .exec()
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec()
    category.link = link
    categories[i] = category
  }
  const pages = await Page.find({});
  let error = req.session.error
  let errMsg = req.session.errMsg
  let msgTitle = req.session.msgTitle
  let message = req.session.message
  delete(req.session.error)
  delete(req.session.errMsg)
  delete(req.session.msgTitle)
  delete(req.session.message)
  res.render('pages', { title: 'Administrator || Pages',
                              categories, pages, error,
                              errMsg, msgTitle, message,
                              hermescraftUrl,
                              user: req.user
  });
});

router.
route('/add').
get(async(req, res, next)=>{
  const categories = await Category.find({}).populate('image')
                                  .exec()
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec()
    category.link = link
    categories[i] = category
  }
  return res.render('add_page', {title: 'HermesCraft || Add Page',
                                  categories,hermescraftUrl,
                                  user: req.user
  })
}).
post(async(req, res, next)=>{
  let banner;
  if (req.files){
    const image = req.files.banner
    imageName = req.body.name+ "." + imageName.split(".")[imageName.split(".").length - 1]
    const err = await image.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', image.name))
      if (err){
        console.log(err)
        const categories = await Category.find({}).populate('image')
                                  .exec()
        for (let i = 0; i < categories.length; i++){
          const category = categories[i]
          const link = await PageLink.findById(category.link).populate('text')
                                      .exec()
          category.link = link
          categories[i] = category
        }
        return res.render('add_page', {title: 'HermesCraft || Add Page',
                                        error: true,
                                        errMsg: "Image upload unsuccessful",
                                        categories: categories,
                                        user: req.user
        })
      }
      
      banner = await PageImage.create({
        name: image.name,
        path: `/public/images/${image.name}`
      }).catch((error)=> {
        console.log(error)
      })
  }

  if (banner){
    req.body.banner = banner._id
  }
  const page = new Page(req.body)
  
  const doc = await page.save().catch((error)=> console.log(error))
  req.session.message = `${doc.name} page added successfully!`

  res.redirect('/pages')
  
})

router.
route('/update').
post(async(req, res, next)=>{
  if (req.body.part){
    const page = await Page.findById(req.body.page)
    
    // Home Page Update
    if (page.name == 'Home'){
      if (req.body.part === 'carousel'){
        const header = await PageText.findByIdAndUpdate(req.body.header, {
          data: req.body.header_text,
          color: req.body.header_color
        })

        const description = await PageText.findByIdAndUpdate(req.body.description, {
          data: req.body.description_text,
          color: req.body.description_color
        })

        const linkText = await PageText.findByIdAndUpdate(req.body.link_text, {
          data: req.body.link_text_data,
          color: req.body.link_text_color
        })

        const link = await PageLink.findByIdAndUpdate(req.body.link, {
          path: req.body.link_path
        })

        let background;
        if (req.files){
          const image = req.files.background
          let imageName = req.body.background_id + "_" + image.name

          const err = await image.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', imageName))
            if (err){
              console.log(err)
              req.session.error = true,
              req.session.errMsg = "Image upload unsuccessful"
              return res.redirect('/pages/'+req.body.page)
            }
            
            background = await CarouselImage.findByIdAndUpdate(req.body.background_id, {
              name: imageName,
              path: `/public/images/${imageName}`
            }).catch((error)=> {
              console.log(error)
            })
        }
      }
      else if (req.body.part == 'category'){
        const linkText = await PageText.findByIdAndUpdate(req.body.link_text_id, {
          data: req.body.link_text,
          color: req.body.link_color
        })

        const link = await PageLink.findByIdAndUpdate(req.body.link, {
          path: req.body.link_path
        })

        const category = await Category.findByIdAndUpdate(req.body.category, {
          name: req.body.name
        })

        if (req.files){
          let image = req.files.image
          let imageName = req.body.imageId + "_" + image.name
          const err = await image.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', imageName))
            if (err){
              console.log(err)
              req.session.error = true,
              req.session.errMsg = "Image upload unsuccessful"
              return res.redirect('/pages/'+req.body.page)
            }
            
            image = await PageImage.findByIdAndUpdate(req.body.imageId, {
              name: imageName,
              path: `/public/images/${imageName}`
            }).catch((error)=> {
              console.log(error)
            })
        }
      }
      else if (req.body.part === 'countdown'){
        try {
          const linkText = await PageText.findByIdAndUpdate(req.body.linkText, {
            data: req.body.link_text,
            color: req.body.link_color
          })
  
          const link = await PageLink.findByIdAndUpdate(req.body.link, {
            path: req.body.link_path
          })

          const oldprice = await PageText.findByIdAndUpdate(req.body.oldpriceId, {
            data: req.body.oldprice,
            color: req.body.oldprice_color
          })

          const newprice = await PageText.findByIdAndUpdate(req.body.newpriceId, {
            data: req.body.newprice,
            color: req.body.newprice_color
          })

          const days = await PageText.findByIdAndUpdate(req.body.daysId, {
            data: req.body.days
          })

          const hours = await PageText.findByIdAndUpdate(req.body.hoursId, {
            data: req.body.hours
          })

          const minutes = await PageText.findByIdAndUpdate(req.body.minutesId, {
            data: req.body.minutes
          })

          const seconds = await PageText.findByIdAndUpdate(req.body.secondsId, {
            data: req.body.seconds
          })

          if (req.files){
            if (req.files.image){
              let image = req.files.image
              let imageName = req.body.imageId + "_" + image.name
              let err = await image.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', imageName))
                if (err){
                  console.log(err)
                  req.session.error = true,
                  req.session.errMsg = "Image upload unsuccessful"
                  return res.redirect('/pages/'+req.body.page)
                }
                
                image = await PageImage.findByIdAndUpdate(req.body.imageId, {
                  name: imageName,
                  path: `/public/images/${imageName}`
                }).catch((error)=> {
                  console.log(error)
                })
            }

            if (req.files.background){
              let background = req.files.background
              let imageName = req.body.imageId + "_" + background.name
              let err = await background.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', imageName))
                if (err){
                  console.log(err)
                  req.session.error = true,
                  req.session.errMsg = "Image upload unsuccessful"
                  return res.redirect('/pages/'+req.body.page)
                }
                
                background = await PageImage.findByIdAndUpdate(req.body.backgroundId, {
                  name: imageName,
                  path: `/public/images/${imageName}`
                }).catch((error)=> {
                  console.log(error)
                })
            }
            
          }
        }
        catch (error){
          console.log(error)
        }
      }
    }

    // About Page Update
    else if (page.name == 'About'){
      const header = await PageText.findByIdAndUpdate(req.body.header, {
        data: req.body.header_text,
        color: req.body.header_color
      })

      const fParagraph = await PageText.findByIdAndUpdate(req.body.f_paragraph, {
        data: req.body.f_paragraph_text
      })

      const sParagraph = await PageText.findByIdAndUpdate(req.body.s_paragraph, {
        data: req.body.s_paragraph_text
      })

      const span = await PageText.findByIdAndUpdate(req.body.span, {
        data: req.body.span_text,
        color: req.body.span_color
      })

      if (req.files){
        const image = req.files.images
        let imageName = req.body.image + "_" + image.name
        const err = await image.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', imageName))
          if (err){
            console.log(err)
            req.session.error = true,
            req.session.errMsg = "Image upload unsuccessful"
            return res.redirect('/pages/'+req.body.page)
          }
          
          image = await PageImage.create({
            name: imageName,
            path: `/public/images/${imageName}`
          }).catch((error)=> {
            console.log(error)
          })
      }
    }
    req.session.message = "Page updated successfully"
    return res.redirect('/pages/'+req.body.page)
  }
  let banner;
  if (req.files){
    const image = req.files.banner
    const err = await image.mv(path.resolve(__dirname, '..', '..', 'hermescraft', 'public', 'images', image.name))
      if (err){
        console.log(err)
        const categories = await Category.find({}).populate('image')
                                  .exec()
        for (let i = 0; i < categories.length; i++){
          const category = categories[i]
          const link = await PageLink.findById(category.link).populate('text')
                                      .exec()
          category.link = link
          categories[i] = category
        }
        return res.render('add_page', {title: 'HermesCraft || Add Product',
                                                error: true,
                                                errMsg: "Image upload unsuccessful",
                                                categories: categories,
                                                user: req.user
        })
      }
      
      banner = await PageImage.create({
        name: image.name,
        path: `/public/images/${image.name}`
      }).catch((error)=> {
        console.log(error)
      })
  }
  const pageId = req.body.pageId
  delete(req.body.pageId)
  if (banner){
    req.body.banner = banner._id
  }
  const page = await Page.findByIdAndUpdate(pageId, req.body).exec()
                          .catch((error)=>{console.log(error)});

  req.session.message = `${page.name} page updated successfully!`
  res.redirect('/pages')
  
})


router.
route('/:pageId')
.get(async(req, res, next)=>{
  const pageId = req.params.pageId
  let page = await Page.findById(pageId).populate('banner')
                        .exec(); 
  for (let i = 0; i < page.sections.length; i++){
    let section = await PageSection.findById(page.sections[i])
                                    .populate('header').populate('paragraphs')
                                    .populate('spans').populate('images')
                                    .populate('background')
                                    .exec(); 

    let links = []
    for (let t = 0; t < section.links.length; t++){
      let link = await PageLink.findById(section.links[t]).populate('text')
                                .exec()
      links.push(link)
    }

    section.links = links

    page.sections[i] = section
  }

  if (page.carousel){
    for (let i = 0; i < page.carousel.length; i++){
      let carousel = await PageCarouselItem.findById(page.carousel[i]).populate('header')
                                            .populate('description').populate('background')
                                            .exec()
      
      carousel.link = await PageLink.findById(carousel.link).populate('text').exec()
      page.carousel[i] = carousel
    }
  }
  const categories = await Category.find({}).populate('image')
                                  .exec()
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec()
    category.link = link
    categories[i] = category
  }
  let error = req.session.error
  let errMsg = req.session.errMsg
  let msgTitle = req.session.msgTitle
  let message = req.session.message
  delete(req.session.error)
  delete(req.session.errMsg)
  delete(req.session.msgTitle)
  delete(req.session.message)
  return res.render('page', {title: `Page - ${page.name}`,
                              page, categories,
                              hermescraftUrl,
                              error, errMsg,
                              msgTitle, message,
                              user: req.user
                    })
})

module.exports = router;
