var express = require('express');
const { userDetails, viewProgress } = require('../Helpers/userHelpers');
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
  userDetails(req.session.user.number).then((details)=>{
    console.log(details);
    req.session.user.name = details.name
      res.render('user',{title: 'pranav', user:true, details, account: req.session.user})

  })


});

router.get('/progress/:id',verifyLogin, (req, res, next) => {
  viewProgress(req.params.id).then((response)=>{
    console.log(response);
      res.render('work-progress',{user:true, progress:response, account: req.session.user})

  })
})
module.exports = router;
