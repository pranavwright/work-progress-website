var express = require('express');
var router = express.Router();



require('dotenv').config()

let verifyLogin=(req,res,next) =>{
  if(req.session.user) {
    next()

  }
  else {

res.redirect("/login")

  }
}

/* GET users listing. */
router.get('/',verifyLogin, function(req, res, next) {
  res.render('user',{title: 'pranav', user:true})
  console.log(req.session.user);


});

router.get('/progress',verifyLogin, (req, res, next) => {
  res.render('work-progress',{user:true})
})
module.exports = router;
