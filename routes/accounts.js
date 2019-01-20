const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');


router.get('/', function(req, res){
    res.send('account app');
});

router.get('/join', function(req, res){
    res.render('accounts/join');
});

router.get('/login', function(req, res){
    res.render('accounts/login');
});

module.exports = router;