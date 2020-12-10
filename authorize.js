const isAdmin = function(req, res, next){
    console.log(req.user)
    if (req.user.role == 'administrator'){
        next()
    }else {
      req.session.error = true
      req.session.errMsg = "Not authorized"
      //req.session.destroy();
      res.clearCookie();
      res.redirect('/login')
    }
}

module.exports = {isAdmin}
