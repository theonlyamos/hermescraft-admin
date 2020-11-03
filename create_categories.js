const mongoose = require('mongoose');
const config = require('./config');
const connect = mongoose.connect(config.mongoUrI, {useNewUrlParser: true,
                                                    useUnifiedTopology: true});
const { PageLink, PageText, PageImage } = require('./models/page');
const Category = require('./models/category');

connect.then((db) => {
  console.log('Connected to database');
},(err) => {
  console.log(err);
})

const createCategories = async()=>{
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

  const linkTexts = await PageText.create(texts).catch((error)=>console.log(error))
  
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
  
  const catImages = await PageImage.create(images).catch((error)=>console.log(error))
  const catLinks = await PageLink.create(links).catch((error)=>console.log(error))

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
  const categories = await Category.create(docs).catch((error)=>console.log(error))
  console.log('Categories created Successfully...')
  mongoose.disconnect()
}

const getCategories = async()=>{
  const categories = await Category.find({}).populate('image')
                                  .exec().catch((error)=>console.log(error))
  for (let i = 0; i < categories.length; i++){
    const category = categories[i]
    const link = await PageLink.findById(category.link).populate('text')
                                .exec().catch((error)=>console.log(error))
    category.link = link
    categories[i] = category
  }
  console.log(categories)
  mongoose.disconnect()
}

createCategories()
//getCategories()