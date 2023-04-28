const express = require('express'); 
const router = express.Router(); 
 

router.get('/', (req, res) => res.render('welcome'));

router.use('/user', require('./user'))
router.use('/transaction', require('./transaction'))

module.exports = router;