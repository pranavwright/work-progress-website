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
    
    req.session.user.name = details.name
      res.render('user',{title: req.session.user.name+" view progress"  , user:true, details, account: req.session.user})

  })


});

router.get('/progress/:id',verifyLogin, (req, res, next) => {
  viewProgress(req.params.id).then((response)=>{
      res.render('work-progress',{title: req.session.user.name+" view progress", user:true, progress:response.progress, updates: response.updates, account: req.session.user,data: response})

  })
})
module.exports = router;