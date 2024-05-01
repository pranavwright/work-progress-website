var express = require('express');
const { createAccount, newWork, listUser, userDetails, viewWork, updateWork, allPendings, allComplete } = require('../Helpers/userHelpers');
var router = express.Router();

const admin = {
  title: 'admin', admin:true
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  listUser().then((response)=>{
    admin.users = response
    res.render('admin/admin',admin);
  })
  
});

router.get("/all-users", (req, res)=>{
  res.render('admin/all-users',admin)
})
router.get('/edit/:number', (req, res)=>{
  userDetails(req.params.number).then((response)=>{
    admin.user=response
    res.render('admin/edit',admin)
  })
})
router.get("/edit-work/:id", (req, res)=>{
  viewWork(req.params.id).then((response)=>{
    admin.data = response
      res.render('admin/edit-work',admin)

  })
})
router.post("/edit-work/:id", (req, res)=>{
  var progress = JSON.parse(req.body.progress)
  var updates = JSON.parse(req.body.updates)
  console.log(updates);
  updateWork(req.params.id, req.body, progress, updates).then((response)=>{
      res.json({sent: true})
  })
})




router.get("/add-user/new-work/:number", (req, res)=>{
  admin.number = req.params.number
  res.render('admin/new-work',admin)
})
router.get('/add-user',(req, res)=>{
  res.render('admin/new-user', admin)
})
router.post('/add-user/',(req, res)=>{
  createAccount(req.body).then((response)=>{
    res.redirect(`/admin/add-user/new-work/${req.body.mobile}`)
  })
})
router.post('/add-user/new-work/',(req, res)=>{
  var json = JSON.parse(req.body.progress)
    newWork(req.body, json).then((response)=>{
      res.json({success:true})
    })
    

})



router.get("/pending", (req, res)=>{
  allPendings().then((pendings)=>{
    admin.pendings = pendings
      res.render('admin/pendings',admin)

  })
})
router.get("/completed", (req, res)=>{
  allComplete().then((completed)=>{
    admin.completed = completed
      res.render('admin/all-complete',admin)

  })
})



module.exports = router;
