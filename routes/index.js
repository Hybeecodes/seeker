const express = require('express');
const router = express.Router();
const {getLogin, getSignUp, authenticate, signup} = require('../controllers/guest.controller');
const { addSchool, getSchools } = require('../controllers/school.controller');
router.get('/', (req,res) => {
    if(req.session.user){
        return res.redirect('/user/dashboard');
    }
    res.render('index');
})

router.get('/contact',(req,res) => {
    is_logged_in = (req.session.user)? true: false;
    res.render('contact',{title: "Campus Hustle - Contact", is_logged_in});
});

router.get('/login', getLogin);

router.get('/signup',getSignUp);

router.post('/login',authenticate);

router.post('/signup',signup);

router.post('/school',addSchool);

router.get('/schools',getSchools);


module.exports = router;