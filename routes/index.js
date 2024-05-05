var express = require('express');
var router = express.Router();
require('dotenv').config()

// firebase auth
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
const { getAuth } = require('firebase-admin/auth');
const { accountExist } = require('../Helpers/userHelpers');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let verifyLogin=(req,res,next) =>{
  if(req.session.admin) {

    res.redirect('/admin')
  }
  if(req.session.user) {

    res.redirect('/users')
  }
  else {
next()
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });

});

router.get("/login",verifyLogin, (req, res)=>{
  if(req.session.user) res.redirect('/users')
  res.render('loginSignup/login')
})

router.post("/user-exist", (req, res)=>{
  accountExist(req.body.userNumber).then((response)=>{
    if(response.admin) res.json({admin:`/admin/login/${response.adminData._id}`})
    else res.json(response)
  })
})


router.post("/login", (req, res)=>{
  let userId = req.body.userId
  getAuth()
  .getUser(userId)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
   // console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    
    let user = {number:req.body.userNumber}
    req.session.user = user
    req.session.user.loginIn = true
    res.json({success:true})

  })
  .catch((error) => {
   // console.log('Error fetching user data:', error);
   res.redirect('/login')
  });
})


router.get('/logout',(req,res)=>{
  req.session.user = null
  res.redirect('/login')
})
module.exports = router;
