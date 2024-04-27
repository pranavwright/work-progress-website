var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user',{title: 'pranav', user:true})
});

router.get('/progress', (req, res, next) => {
  res.render('work-progress',{user:true})
})

module.exports = router;
