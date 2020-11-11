const isAdmin = function(req, res, next){
    if (req.user.role == 'administrator'){
        next()
    }else {
      req.session.destroy();
      res.clearCookie();
      req.session.error = true
      req.session.errMsg = "Not authorized"
      res.redirect('/login')
    }
}

module.exports = {isAdmin}
