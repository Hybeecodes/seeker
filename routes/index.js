const express = require('express');
const router = express.Router();
const {getLogin, getSignUp, authenticate, signup} = require('../controllers/guest.controller');
const { addSchool, getSchools, getAllSchools } = require('../controllers/school.controller');
const { addService, getAllServices} = require('../controllers/service.controller');
router.get('/', async(req,res) => {
    if(req.session.user){
        return res.redirect('/user/dashboard');
    }
    const services = await getAllServices();
    const hasServices = services.length;
    const schools = await getAllSchools();
    res.render('index', {title: "Campus Hot Jobs", services, schools, hasServices});
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

router.post('/service',addService);


module.exports = router;