var express = require('express');
const { createAccount, newWork, listUser, userDetails, viewWork, updateWork, allPendings, allComplete, editUser } = require('../Helpers/userHelpers');
const { adminLogIn } = require('../Helpers/adminHelper');
var router = express.Router();

const admin = {
  title: 'admin', admin:true
}

let verifyLogin=(req,res,next) =>{
  if(req.session.admin) { 
    next()
  }
  else {
    res.redirect("/login")
  }
}


/* GET users listing. */
router.get('/',verifyLogin, function(req, res, next) {

  listUser().then((response)=>{
    admin.users = response
    admin.data = req.session.admin
    res.render('admin/admin',admin);
  })
  
});

router.get("/all-users",verifyLogin, (req, res)=>{
  res.render('admin/all-users',admin)
})
router.get('/edit/:number',verifyLogin, (req, res)=>{
  userDetails(req.params.number).then((response)=>{
    admin.user=response
    
    res.render('admin/edit',admin)
  })
})
router.get("/edit-work/:id",verifyLogin, (req, res)=>{
  viewWork(req.params.id).then((response)=>{
    admin.data = response
      res.render('admin/edit-work',admin)

  })
})
router.post("/edit-work/:id",verifyLogin, (req, res)=>{
  var progress = JSON.parse(req.body.progress)
  var updates = JSON.parse(req.body.updates)
  updateWork(req.params.id, req.body, progress, updates).then((response)=>{
      res.json({sent: true})
  })
})




router.get("/add-user/new-work/:number",verifyLogin, (req, res)=>{
  admin.number = req.params.number
  res.render('admin/new-work',admin)
})
router.get('/add-user',verifyLogin,(req, res)=>{
  res.render('admin/new-user', admin)
})
router.post('/add-user/',verifyLogin,(req, res)=>{
  createAccount(req.body).then((response)=>{
    res.redirect(`/admin/add-user/new-work/${req.body.mobile}`)
  })
})
router.post('/add-user/new-work/',verifyLogin,(req, res)=>{
  var json = JSON.parse(req.body.progress)
    newWork(req.body, json).then((response)=>{
      res.json({success:true})
    })
    

})
router.get('/edit-user/:number',verifyLogin,(req, res)=>{
  userDetails(req.params.number).then((user)=>{
    admin.user = user;
    res.render('admin/edit-user',admin)
  })
    

})
router.post('/edit-user/:id',verifyLogin,(req, res)=>{

    editUser(req.params.id, req.body).then((response)=>{
      res.redirect('/admin')
    })
    

})



router.get("/pending",verifyLogin, (req, res)=>{
  allPendings().then((pendings)=>{
    admin.pendings = pendings
      res.render('admin/pendings',admin)

  })
})
router.get("/completed",verifyLogin, (req, res)=>{
  allComplete().then((completed)=>{
    admin.completed = completed
      res.render('admin/all-complete',admin)

  })
})



router.get('/login/:id',(req,res)=>{
  res.render('loginSignup/admin-login')
})
router.post('/login',(req,res)=>{
  adminLogIn(req.body).then((response)=>{
    req.session.admin = response.admin
    if(req.session.admin) req.session.admin.password = null
    
    response.admin = null
    

    res.json(response)
  })
})
router.get('/logout',(req,res)=>{
  req.session.admin = null
  res.redirect('/login')
})

module.exports = router;
