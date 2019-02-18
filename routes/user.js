const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {
    res.redirect('/user/dashboard');
})

router.get('/dashboard')


module.exports = router;