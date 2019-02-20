const express = require('express');
const router = express.Router();
const {getLogin, getSignUp, authenticate, signup} = require('../controllers/guest.controller');
const { addSchool, getSchools } = require('../controllers/school.controller');
router.get('/', (req,res) => {
    res.render('index');
})

router.get('/login', getLogin);

router.get('/signup',getSignUp);

router.post('/login',authenticate);

router.post('/signup',signup);

router.post('/school',addSchool);

router.get('/schools',getSchools);


module.exports = router;