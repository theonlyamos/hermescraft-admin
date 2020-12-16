var express = require('express');
const debug = require('../debugger');
const { SiteInfo, SiteContact } = require('../models/settings');
const router = express.Router();

const { hermescraftUrl, hermescraftAdminUrl } = require('../config');

router.
route('/').
get(async function(req, res, next) {
  try {
    const siteInfo = await SiteInfo.find({}).populate('favicon')
                                   .populate('logo').populate('contacts');
    const message = req.session.message
    const error = req.session.error
    const errMsg = req.session.errMsg

    req.session.message = ""
    req.session.error = false
    req.session.errMsg = ""
    res.render('settings', { title: 'HermesCraft || Settings',
                        hermescraftUrl, hermescraftAdminUrl,
                        user: req.user,
                        siteInfo,
                        message, error, errMsg
    });
  } 
  catch (error) {
    debug.error(error)
    return res.redirect('/')
  }
});

router.
route('/contacts').
get(async (req, res, next)=>{
  try {
    if (req.query && req.query.action){
      if (req.query.action === 'delete'){
        const contact = await SiteContact.findByIdAndRemove(req.query.contact)
        let siteinfo = await SiteInfo.findOne();
        let contacts = siteinfo.contacts

        if (contacts.includes(contact._id)){
          contacts.splice(contacts.indexOf(contact._id), 1)

          siteinfo.contacts = contacts
          await siteinfo.save()
          req.session.message = "Contact deleted successfully"
        }
      }
    }
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = error
  }

  res.redirect('/settings')
})

router.
route('/contacts/update').
post(async (req, res, next)=>{
  try {
    const contactId = req.body.contact
    delete(req.body.contact)
    const contact = await SiteContact.findByIdAndUpdate(contactId, req.body)
    req.session.message = "Update Successful"
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = 'Error updating info'
  }

  res.redirect('/settings')

})

router.
route('/contacts/add').
post(async (req, res, next)=>{
  try {
    const contact = await SiteContact.create(new SiteContact(req.body))
    let siteinfo = await SiteInfo.findOne();
    let contacts = siteinfo.contacts
    contacts.push(contact._id)
    siteinfo.contacts = contacts
    await siteinfo.save()
    req.session.message = "Contact info added Successfully"
  } 
  catch (error) {
    debug.error(error)
    req.session.error = true
    req.session.errMsg = 'Error add contact info'
  }

  res.redirect('/settings')

})

module.exports = router;
