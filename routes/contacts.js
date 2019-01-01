const express = require('express');
const router = express.Router();
const ContractsModel = require('../models/ContactsModel');

router.get('/', (req,res)=>{
    ContractsModel.find({}, (err,contacts)=>{
        res.render('contacts/list',{
            "contacts" : contacts
        });
    });
});

router.get('/write',(req,res)=>{
    res.render('contacts/form');
});

router.post('/write',(req,res)=>{
    var contact = new ContractsModel({
        title : req.body.title,
        content : req.body.content,
        name : req.body.name
    });
    contact.save((err)=>{
        res.redirect('/contacts/');
    });
});

module.exports = router;