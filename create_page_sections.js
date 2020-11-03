const mongoose = require('mongoose');
const config = require('./config');
var connect = mongoose.connect(config.mongoUrI, {useNewUrlParser: true,
                                                    useUnifiedTopology: true});

connect.then((db) => {
  console.log('Connected to database');
},(err) => {
  console.log(err);
})

const { Page, PageSection, PageText, PageImage, CarouselImage, PageCarouselItem, PageLink } = require('./models/page');

const createHomeCarousel = async()=>{
  const home = await Page.findOne({"name": "Home"})
                          .catch((error)=>console.log(error));
  const carouselImages = [
    new CarouselImage({
      name: "master-slide-08.jpg",
      path: "/images/master-slide-08.jpg"
    }),
    new CarouselImage({
      name: "master-slide-08.jpg",
      path: "/images/master-slide-08.jpg"
    }),
    new CarouselImage({
      name: "master-slide-08.jpg",
      path: "/images/master-slide-08.jpg"
    })
  ]

  const carouselHeaders = [
    new PageText({data: "Flash Sale"}),
    new PageText({data: "Flash Sale"}),
    new PageText({data: "Flash Sale"})
  ]
  const headers = await PageText.create(carouselHeaders)
                                .catch((error)=>console.log(error))

  const carouselDescriptions = [
    new PageText({data: "New Medical Equipments"}),
    new PageText({data: "New Medical Equipments"}),
    new PageText({data: "New Medical Equipments"})
  ]
  const descriptions = await PageText.create(carouselDescriptions)
                                .catch((error)=>console.log(error))
  
  const carouselLinkTexts = [
    new PageText({data: "Shop Now"}),
    new PageText({data: "Shop Now"}),
    new PageText({data: "Shop Now"})
  ]
  const linkTexts = await PageText.create(carouselLinkTexts)
                                .catch((error)=>console.log(error))
  
  let carouselLinks = []
  
  for (let i = 0; i < linkTexts.length; i++){
    console.log(linkTexts[i]._id)
    carouselLinks.push(new PageLink({path: "/", text: linkTexts[i]._id}))
  }

  const links = await PageLink.create(carouselLinks).catch((error)=>console.log(error))

  const Images = await CarouselImage.create(carouselImages)
                                    .catch((error)=>console.log(error))
  
  
  const carouselItems = Images.map((image, i)=>{
    return new PageCarouselItem({
        page: home._id,
        background: image._id,
        header: headers[i]._id,
        description: descriptions[i]._id,
        link: links[i]._id
    })
  })

  const carousel = await PageCarouselItem.create(carouselItems).catch((error)=>console.log(error))

  home.carousel = carousel.map((c, i)=>c._id)
  const newHome = await home.save().catch((error)=>console.log(error))
  console.log(newHome)
}

const createHomeSections = async()=>{
  const home = await Page.findOne({"name": "Home"})
                          .catch((error)=>console.log(error));
  const background = new PageImage({
      name: "bg-banner-02.jpg",
      path: "/images/images/bg-banner-02.jpg"
    })
  
  const image = new PageImage({
      name: "shop-item-09.jpg",
      path: "/images/shop-item-09.jpg"
  })
  
  const carouselHeaders = [
    new PageText({data: "Our Products"}),
    new PageText({data: "Trending"}),
    new PageText({data: "Promotions"})
  ]
  const headers = await PageText.create(carouselHeaders)
                                .catch((error)=>console.log(error))
  const imageDoc = await PageImage.create(image).catch((error)=>console.log(error))
  const backroundDic = await PageImage.create(background).catch((error)=>console.log(error))
  
  const spans = [
    new PageText({data: "20.00"}),
    new PageText({data: "15.90"}),
    new PageText({data: "69"}),
    new PageText({data: "days"}),
    new PageText({data: "12"}),
    new PageText({data: "hrs"}),
    new PageText({data: "59"}),
    new PageText({data: "mins"}),
    new PageText({data: "59"}),
    new PageText({data: "secs"}),
  ]
  const sectionSpans = await PageText.create(spans).catch((error)=>console.log(error))
  const span_ids = sectionSpans.map((s, i)=>s._id)
  const text = await PageText.create(new PageText({data: 'Gafas sol Hawkers one'}))
                              .catch((error)=>console.log(error))

  const link = await PageLink.create(new PageLink({
    path: '/shop',
    text: text._id
  })).catch((error)=>console.log(error))

  const section = [
    new PageSection({
      page: home._id,
      header: headers[0]._id
    }),
    new PageSection({
      page: home._id,
      header: headers[1]._id
    }),
    new PageSection({
      page: home._id,
      background: backroundDic._id,
      images: [imageDoc._id],
      header: headers[2]._id,
      links: [link._id],
      spans: span_ids
    })
  ]

  const sections = await PageSection.create(section).catch((error)=>console.log(error))

  home.sections = sections.map((c, i)=>c._id)
  const newHome = await home.save().catch((error)=>console.log(error))
  console.log(newHome)
}

const createAboutSections = async()=>{
  const about = await Page.findOne({"name": "About"})
                          .catch((error)=>console.log(error));

  const image = new PageImage({
      name: "banner-14.jpg",
      path: "/images/banner-14.jpg"
  })

  const paragraphTexts = [
    new PageText({
      data: "Phasellus egestas nisi nisi, lobortis ultricies risus semper nec. Vestibulum pharetra ac ante ut pellentesque. Curabitur fringilla dolor quis lorem accumsan, vitae molestie urna dapibus. Pellentesque porta est ac neque bibendum viverra. Vivamus lobortis magna ut interdum laoreet. Donec gravida lorem elit, quis condimentum ex semper sit amet. Fusce eget ligula magna. Aliquam aliquam imperdiet sodales. Ut fringilla turpis in vehicula vehicula. Pellentesque congue ac orci ut gravida. Aliquam erat volutpat. Donec iaculis lectus a arcu facilisis, eu sodales lectus sagittis. Etiam pellentesque, magna vel dictum rutrum, neque justo eleifend elit, vel tincidunt erat arcu ut sem. Sed rutrum, turpis ut commodo efficitur, quam velit convallis ipsum, et maximus enim ligula ac ligula. Vivamus tristique vulputate ultricies. Sed vitae ultrices orci."
    }),
    new PageText({
      data: "Creativity is just connecting things. When you ask creative people how they did something, they feel a little guilty because they didn't really do it, they just saw something. It seemed obvious to them after a while."
    })
  ]
  
  const headerText = new PageText({data: "My Story"})
  const spanText = new PageText({data: "Steve Jobs"})

  const paragraphs = await PageText.create(paragraphTexts).catch((error)=>console.log(error))
  const header = await PageText.create(headerText).catch((error)=>console.log(error))
  const span = await PageText.create(spanText).catch((error)=>console.log(error))
  const imageDoc = await PageImage.create(image).catch((error)=>console.log(error))
  
  const section = [
    new PageSection({
      page: about._id,
      header: header._id,
      paragraphs: paragraphs.map((p, i)=>p._id),
      spans: [span._id],
      images: [imageDoc._id]
    })
  ]

  const sections = await PageSection.create(section).catch((error)=>console.log(error))

  about.sections = sections.map((s, i)=>s._id)
  const newabout = await about.save().catch((error)=>console.log(error))
  console.log(newabout)
}

const resetHomePage = async()=>{
  const home = await Page.findOne({"name": "Home"})
                          .catch((error)=>console.log(error));
  
  for (let i = 0; i< home.sections.length; i++){
    console.log("==> Deleting section: "+home.sections[i]._id+"... <==")
    const section = await PageSection.findByIdAndRemove(home.sections[i]._id)
                                    .catch((error)=>console.log(error));
    console.log(":: Deleting section header...")
    const header = await PageText.findByIdAndRemove(home.sections[i].header)
                                 .catch((error)=>console.log(error));
    if (home.sections[i].background){
      console.log(":: Deleting section background...")
      const background = await PageImage.findByIdAndRemove(home.sections[i].background)
                                 .catch((error)=>console.log(error));
    }

    if (home.sections[i].images){
      for (let k = 0; k < home.sections[i].images; k++){
        console.log(":: Deleting section image: "+home.sections[i].images[k]+"...")
        const image = await PageImage.findByIdAndRemove(home.sections[i].images[k])
                                 .catch((error)=>console.log(error));
      }
    }
    console.log("<== Section Deleted ==>")
    console.log("")
  }

  for (let i = 0; i < home.carousel; i++){
    console.log("==> Deleting carousel... <==")
    const carousel = await PageCarouselItem.findByIdAndRemove(home.carousel[i]._id)
                                 .catch((error)=>console.log(error));
    console.log(":: Deleting carousel header...")
    const header = await PageText.findByIdAndRemove(home.carousel[i].header)
                                 .catch((error)=>console.log(error));
    console.log(":: Deleting carousel description...")
    const description = await PageText.findByIdAndRemove(home.carousel[i].description)
                                 .catch((error)=>console.log(error));
    console.log(":: Deleting carousel link...")
    const link = await PageLink.findByIdAndRemove(home.carousel[i].link)
                                 .catch((error)=>console.log(error));
    console.log(":: Deleting carousel background...")
    const background = await CarouselImage.findByIdAndRemove(home.carousel[i].background)
                                 .catch((error)=>console.log(error));
    console.log("<== Carousel Deleted ==>")
    console.log("")
  }
  home.sections = []
  home.carousel = []
  const newHome = await home.save().catch((error)=>console.log(error))
  console.log(newHome)
}

const resetAboutPage = async()=>{
  const about = await Page.findOne({"name": "About"})
                          .catch((error)=>console.log(error));
  about.sections = []
  const newAbout = await about.save().catch((error)=>console.log(error))
  console.log(newAbout)
}

const getHomePage = async()=>{
  const home = await Page.findOne({"name": "Home"}).populate('banner')
                          .exec().catch((error)=>console.log(error));
  for (let i = 0; i < home.sections.length; i++){
    let section =  await PageSection.findById(home.sections[i]).populate('header')
                                    .populate('paragraphs').populate('spans')
                                    .populate('background').populate('images')
                                    .exec().catch((error)=>console.log(error));

    let links = []
    for (let t = 0; t < section.links.length; t++){
      let link =  await PageLink.findById(section.links[t]).populate('text')
                                .exex().catch((error)=>console.log(error))
      links.push(link)
    }
    home.sections[i] = section
    home.sections[i].links = links

    console.log(home.sections[i])
  }

  if (home.carousel){
    for (let i = 0; i < home.carousel.length; i++){
      let carousel = await PageCarouselItem.findById(home.carousel[i]).populate('header')
                                    .populate('background').populate('description')
                                    .exec().catch((error)=>console.log(error));
      carousel.link =  await PageLink.findById(carousel.link).populate('text')
                                .exec().catch((error)=>console.log(error))
      home.carousel[i] = carousel
      console.log(home.carousel[i])
    }
  }

}

const getAboutPage = async()=>{
  const about = await Page.findOne({"name": "About"}).populate('sections')
                          .exec().catch((error)=>console.log(error));
  console.log(about)
  for (let i = 0; i < about.sections.length; i++){
    let section = about.sections[i]

    let images = []
    for (let k = 0; k < section.images.length; k++){
      let image = await PageImage.findById(section.images[k]).catch((error)=>console.log(error))
      images.push(image)
    }

    about.sections[i].images = images

    console.log(about.sections[i])
  }

}

const runScript = async()=>{
  //await resetHomePage()
  //await resetAboutPage()
  await createHomeCarousel()
  await createHomeSections();
  await createAboutSections();
  //await getHomePage();
  //await getAboutPage();
  mongoose.disconnect()
}

runScript()
