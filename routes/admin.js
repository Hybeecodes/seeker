const express = require('express');
const router = express.Router();
const { getLogin, authenticate, getUsers, getIndex, getServices, create, suspendUser, removeUser, unSuspendUser } = require('../controllers/admin.controller');
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

module.exports = router;