const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/user.controller');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');


router.use(ensureLoggedIn)

router.get('/', (req,res,next) => {
    res.redirect('/user/dashboard');
})

router.get('/contact',(req,res,next) => {
    is_logged_in = (req.session.user)? true: false;
    res.render('contact',{title: "Campus Hustle - Contact", is_logged_in});
})

router.get('/logout', (req,res) => {
    // destroy user session
    req.session.user = null;
    res.redirect('/login');
})

router.get('/dashboard', getDashboard);


module.exports = router;