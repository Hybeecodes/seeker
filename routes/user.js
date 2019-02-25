const express = require('express');
const router = express.Router();
const { getDashboard, postProfile, addUserService, removeUserService, search, getUserProfilePage, reviewUser } = require('../controllers/user.controller');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');



router.use(ensureLoggedIn)

router.get('/', (req,res,next) => {
    res.redirect('/user/dashboard');
})

router.get('/contact',(req,res,next) => {
    is_logged_in = (req.session.user)? true: false;
    res.render('contact',{title: "Campus Hustle - Contact", is_logged_in});
})


router.post('/profile',postProfile);

router.get('/dashboard', getDashboard);

router.post('/add_services',addUserService);

router.post('/remove_service', removeUserService);

router.get('/search',search);

router.get('/profile/:id',getUserProfilePage);

router.post('/review',reviewUser);

router.get('/logout', (req,res) => {
    // destroy user session
    req.session.user = null;
    res.redirect('/login');
})


module.exports = router;