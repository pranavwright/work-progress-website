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

router.get('/progress/:id', (req, res, next) => {
  viewProgress(req.params.id).then((response)=>{
    console.log(response.updates[0].progress);
      res.render('work-progress',{user:true, progress:response.progress, updates: response.updates, account: req.session.user})

  })
})
module.exports = router;