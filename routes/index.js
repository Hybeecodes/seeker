const express = require('express');
const router = express.Router();
const {getLogin, getSignUp, authenticate, signup} = require('../controllers/guest.controller');

router.get('/', (req,res) => {
    res.render('index');
})

router.get('/login', getLogin);

router.get('/signup',getSignUp);

router.post('/login',authenticate);

router.post('/signup',signup);


module.exports = router;