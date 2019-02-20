const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/user.controller');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');


router.use(ensureLoggedIn)

router.get('/', (req,res,next) => {
    res.redirect('/user/dashboard');
})

router.get('/dashboard', getDashboard);


module.exports = router;