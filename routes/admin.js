var express = require('express');
var router = express.Router();

const admin = {
  title: 'admin', admin:true
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin',admin);
});

router.get("/all-users", (req, res)=>{
  res.render('admin/all-users',admin)
})
router.get("/edit-work", (req, res)=>{
  res.render('admin/edit-work',admin)
})
router.get("/new-work", (req, res)=>{
  res.render('admin/new-work',admin)
})
router.get('/add-user',(req, res)=>{
  res.render('admin/new-user', admin)
})
router.get("/pending", (req, res)=>{
  res.render('admin/pendings',admin)
})


module.exports = router;
