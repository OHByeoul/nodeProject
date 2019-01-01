const express = require('express');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel');

router.get('/', (req,res)=>{
    res.send('admin app')
});

router.get('/products', (req,res)=>{
    ProductsModel.find({}, (err,products)=>{ //제품리스트를 출력하기 위해 
        res.render('admin/products',
            {"products" : products} // DB에서 받은 products를 products변수명으로 내보냄
        );
    });
}); //render를 사용하면 자동으로 views아래의 폴더를 인식함

router.get('/products/write', (req,res)=>{
    res.render('admin/form');
});

router.post('/products/write',(req,res)=>{
    var product = new ProductsModel({
        name : req.body.name,
        price : req.body.price,
        description : req.body.description
    });
    product.save((err)=>{
        res.redirect('/admin/products');
    });
});


module.exports = router;