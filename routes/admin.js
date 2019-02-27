const express = require('express');
const router = express.Router();
const { getLogin, authenticate, getUsers, getIndex, getServices, create, suspendUser, removeUser, unSuspendUser,removeService, updateService } = require('../controllers/admin.controller');
const {addService} = require('../controllers/service.controller');
const ensureLoggedIn = require('../middlewares/ensureAdminLoggedIn');

router.get('/login',getLogin);

router.post('/login',authenticate);

router.post('/signup', create);

router.use(ensureLoggedIn);

router.get('/',getIndex);

router.get('/dashboard',getIndex);

router.get('/users',getUsers);

router.post('/suspend_user/:id',suspendUser);

router.post('/unsuspend_user/:id',unSuspendUser);

router.post('/delete_user/:user_id',removeUser);

router.get('/services', getServices);

router.post('/add_service',addService);

router.post('/delete_service/:service_id',removeService)

router.post('/update_service',updateService);

router.get('/logout', (req,res) => {
    req.session.admin = null;
    res.redirect('/admin/login');
})

module.exports = router;