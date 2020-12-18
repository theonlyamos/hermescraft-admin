const mongoose = require('mongoose');
const config = require('./config');
const { SiteInfo, SiteContact  } = require('./models/settings');
const { Page, PageSection, PageText, PageImage, CarouselImage, PageCarouselItem, PageLink } = require('./models/page');
const Category = require('./models/category');
const { hermescraftUrl } = require('./config');

var connect = mongoose.connect(config.mongoUrI, {useNewUrlParser: true,
                                                    useUnifiedTopology: true});

connect.then((db) => {
  console.log('Connected to database');
},(err) => {
  console.log(err);
})

const siteSetup = async()=>{
    try{
        const ContactModels = [
            new SiteContact({
                type: 'phone',
                text: '+233-557-821-030',
                url: 'tel:+233557821030'
            }),
            new SiteContact({
                type: 'phone',
                text: '+233-557-821-030',
                url: 'tel:+233557821030'
            }),
            new SiteContact({
                type: 'email',
                text: 'info@hermescraft.com',
                url: 'mailto: info@hermescraft.com'
            })
        ]

        const FaviconModel = new PageImage({
            name: 'favicon.ico',
            path: 'images/icons/favicon.ico'
        })

        const LogoModel = new PageImage({
            name: 'hermescraft-2.png',
            path: 'images/icons/hermescraft-2.png'
        })

        let contacts = await SiteContact.create(ContactModels);
        contacts = contacts.map((c, i)=>c._id);
        const favicon = await PageImage.create(FaviconModel);
        const logo = await PageImage.create(LogoModel);

        const SettingsModel = new SiteInfo({
            name: 'Hermescraft',
            url: hermescraftUrl,
            favicon: favicon._id,
            logo: logo._id,
            contacts: contacts 
        })

        const settings = await SiteInfo.create(SettingsModel);
        console.log(settings)
    }
    catch(error){
        console.log(error)
    }
}

const createCategories = async()=>{
  try {
    const images = [
      new PageImage({
        name: 'medical.png'
      }),
      new PageImage({
        name: 'electronics.png'
      }),
      new PageImage({
        name: 'disability.png'
      })
    ]
  
    const texts = [
      new PageText({
        data: 'Medical Equipments'
      }),
      new PageText({
        data: 'Electronic Products'
      }),
      new PageText({
        data: 'Disability Products'
      }),
    ]
  
    const linkTexts = await PageText.create(texts)
    
    const links = [
      new PageLink({
        text: linkTexts[0]._id,
        path: '/search?category=Medical'
      }),
      new PageLink({
        text: linkTexts[1]._id,
        path: '/search?category=Electronics'
      }),
      new PageLink({
        text: linkTexts[2]._id,
        path: '/search?category=Disabilities'
      }),
    ]
    
    const catImages = await PageImage.create(images)
    const catLinks = await PageLink.create(links)
  
    const docs = [
      new Category({
        name: 'Medical', 
        image: catImages[0]._id,
        link: catLinks[0]._id
      }),
      new Category({
        name: 'Electronics', 
        image: catImages[1]._id,
        link: catLinks[1]._id
      }),
      new Category({
        name: 'Disabilities', 
        image: catImages[2]._id,
        link: catLinks[2]._id
      })
    ];
    const categories = await Category.create(docs)
    console.log('Categories created Successfully...')
  } 
  catch (error) {
    console.log(error)
  }
}

const getCategories = async()=>{
  try {
    const categories = await Category.find({}).populate('image')
                                  
    for (let i = 0; i < categories.length; i++){
      const category = categories[i]
      const link = await PageLink.findById(category.link).populate('text')
                                  
      category.link = link
      categories[i] = category
    }
    console.log(categories)
  } 
  catch (error) {
    console.log(error)
  }
}

const createPages = async()=>{
  try {
    const pages = [
      new Page({
        name: "Home",
        title: "Hermescraft || Home",
        path: "/",
        icon: "home"
      }),
      new Page({
        name: "Shop",
        title: "Hermescraft || Shop",
        path: "/shop",
        icon: "shopping-basket",
        header: "Shop",
        subheader: "Quality Products at Affordable Prices"
      }),
      new Page({
        name: "Cart",
        title: "Hermescraft || Cart",
        path: "/cart",
        icon: "shopping-cart",
        header: "Cart"
      }),
      new Page({
        name: "About",
        title: "Hermescraft || About Us",
        path: "/about",
        icon: "exclamation",
        header: "About Us"
      }),
      new Page({
        name: "Contact",
        title: "Hermescraft || Contact Us",
        path: "/contact",
        icon: "phone",
        header: "Contact Us"
      })
    ]
  
    const docs = await Page.create(pages)
    if (docs){
      console.log("Pages created successfully")
    }
  } 
  catch (error) {
    console.log(error)
  }
}

const createHomeCarousel = async()=>{
  try {
    const home = await Page.findOne({"name": "Home"})
                          
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
                                  

    const carouselDescriptions = [
      new PageText({data: "New Medical Equipments"}),
      new PageText({data: "New Medical Equipments"}),
      new PageText({data: "New Medical Equipments"})
    ]
    const descriptions = await PageText.create(carouselDescriptions)
                                  
    
    const carouselLinkTexts = [
      new PageText({data: "Shop Now"}),
      new PageText({data: "Shop Now"}),
      new PageText({data: "Shop Now"})
    ]
    const linkTexts = await PageText.create(carouselLinkTexts)
    
    let carouselLinks = []
    
    for (let i = 0; i < linkTexts.length; i++){
      console.log(linkTexts[i]._id)
      carouselLinks.push(new PageLink({path: "/", text: linkTexts[i]._id}))
    }

    const links = await PageLink.create(carouselLinks)

    const Images = await CarouselImage.create(carouselImages)
                                      
    
    
    const carouselItems = Images.map((image, i)=>{
      return new PageCarouselItem({
          page: home._id,
          background: image._id,
          header: headers[i]._id,
          description: descriptions[i]._id,
          link: links[i]._id
      })
    })

    const carousel = await PageCarouselItem.create(carouselItems)

    home.carousel = carousel.map((c, i)=>c._id)
    const newHome = await home.save()
    console.log(newHome)
  } 
  catch (error) {
    console.log(error)
  }
  
}

const createHomeSections = async()=>{
  try {
    const home = await Page.findOne({"name": "Home"})
                          ;
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
    const imageDoc = await PageImage.create(image)
    const backroundDic = await PageImage.create(background)
    
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
    const sectionSpans = await PageText.create(spans)
    const span_ids = sectionSpans.map((s, i)=>s._id)
    const text = await PageText.create(new PageText({data: 'Gafas sol Hawkers one'}))
                                

    const link = await PageLink.create(new PageLink({
      path: '/shop',
      text: text._id
    }))

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

    const sections = await PageSection.create(section)

    home.sections = sections.map((c, i)=>c._id)
    const newHome = await home.save()
    console.log(newHome)
  } 
  catch (error) {
    console.log(error)
  }
}

const createAboutSections = async()=>{
  try {
    const about = await Page.findOne({"name": "About"})

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

    const paragraphs = await PageText.create(paragraphTexts)
    const header = await PageText.create(headerText)
    const span = await PageText.create(spanText)
    const imageDoc = await PageImage.create(image)
    
    const section = [
      new PageSection({
        page: about._id,
        header: header._id,
        paragraphs: paragraphs.map((p, i)=>p._id),
        spans: [span._id],
        images: [imageDoc._id]
      })
    ]

    const sections = await PageSection.create(section)

    about.sections = sections.map((s, i)=>s._id)
    const newabout = await about.save()
    console.log(newabout)
  } 
  catch (error) {
    console.log(error)
  }
}

const resetHomePage = async()=>{
  try {
    const home = await Page.findOne({"name": "Home"})
  
    for (let i = 0; i< home.sections.length; i++){
      console.log("==> Deleting section: "+home.sections[i]._id+"... <==")
      const section = await PageSection.findByIdAndRemove(home.sections[i]._id)
                                      ;
      console.log(":: Deleting section header...")
      const header = await PageText.findByIdAndRemove(home.sections[i].header)
                                  ;
      if (home.sections[i].background){
        console.log(":: Deleting section background...")
        const background = await PageImage.findByIdAndRemove(home.sections[i].background)
                                  ;
      }

      if (home.sections[i].images){
        for (let k = 0; k < home.sections[i].images; k++){
          console.log(":: Deleting section image: "+home.sections[i].images[k]+"...")
          const image = await PageImage.findByIdAndRemove(home.sections[i].images[k])
                                  ;
        }
      }
      console.log("<== Section Deleted ==>")
      console.log("")
    }

    for (let i = 0; i < home.carousel; i++){
      console.log("==> Deleting carousel... <==")
      const carousel = await PageCarouselItem.findByIdAndRemove(home.carousel[i]._id)
                                  ;
      console.log(":: Deleting carousel header...")
      const header = await PageText.findByIdAndRemove(home.carousel[i].header)
                                  ;
      console.log(":: Deleting carousel description...")
      const description = await PageText.findByIdAndRemove(home.carousel[i].description)
                                  ;
      console.log(":: Deleting carousel link...")
      const link = await PageLink.findByIdAndRemove(home.carousel[i].link)
                                  ;
      console.log(":: Deleting carousel background...")
      const background = await CarouselImage.findByIdAndRemove(home.carousel[i].background)
                                  ;
      console.log("<== Carousel Deleted ==>")
      console.log("")
    }
    home.sections = []
    home.carousel = []
    const newHome = await home.save()
    console.log(newHome)
  } 
  catch (error) {
    console.log(error)
  }
}

const resetAboutPage = async()=>{
  try {
    const about = await Page.findOne({"name": "About"})
                          ;
    about.sections = []
    const newAbout = await about.save()
    console.log(newAbout)
  } 
  catch (error) {
    console.log(error)  
  }
}

const getHomePage = async()=>{
  try {
    const home = await Page.findOne({"name": "Home"}).populate('banner').exec();

    for (let i = 0; i < home.sections.length; i++){
      let section =  await PageSection.findById(home.sections[i]).populate('header')
                                      .populate('paragraphs').populate('spans')
                                      .populate('background').populate('images')
                                      .exec();

      let links = []
      for (let t = 0; t < section.links.length; t++){
        let link =  await PageLink.findById(section.links[t]).populate('text')
                                  .exex()
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
                                      .exec();
        carousel.link =  await PageLink.findById(carousel.link).populate('text')
                                  .exec()
        home.carousel[i] = carousel
        console.log(home.carousel[i])
      }
    }
  } 
  catch (error) {
    console.log(error)
  }

}

const getAboutPage = async()=>{
  try {
    const about = await Page.findOne({"name": "About"}).populate('sections')
                          .exec();
    console.log(about)
    for (let i = 0; i < about.sections.length; i++){
      let section = about.sections[i]

      let images = []
      for (let k = 0; k < section.images.length; k++){
        let image = await PageImage.findById(section.images[k])
        images.push(image)
      }

      about.sections[i].images = images

      console.log(about.sections[i])
    }
  } 
  catch (error) {
    console.log(error)
  }
  

}

const runScript = async()=>{
  try {
    //await siteSetup()
    //await resetHomePage()
    //await resetAboutPage()
    await createCategories();
    await createPages();
    await createHomeCarousel();
    await createHomeSections();
    await createAboutSections();
    //await getCategories();
    //await getHomePage();
    //await getAboutPage();
  }
  catch(error){
    console.log(error)
  }

  mongoose.disconnect()
  
}

runScript()
