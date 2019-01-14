const express = require('express');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel');
const CommentsModel = require('../models/CommentsModel');

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

//작성
router.get('/products/write', (req,res)=>{
    res.render('admin/form', {'product' : ""}); // 수정과 같은 템플릿을 사용하기 때문에 뒤에 빈 값을 추가해준다.
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

//제품정보

router.get('/products/detail/:id', (req,res)=>{
    ProductsModel.findOne({'id' : req.params.id}, (err,product)=>{
        //각 제품당 댓글들
        CommentsModel.find({'product_id' : req.params.id}, (err,comments)=>{
            res.render('admin/productDetail', {'product' : product, 'comments':comments});
        });     
    });
});

//수정

router.get('/products/edit/:id', (req,res)=>{ 
    ProductsModel.findOne({'id' : req.params.id}, (err,product)=>{
        res.render('admin/form', {'product' : product});
    });
});

router.post('/products/edit/:id', (req,res)=>{
    let query = {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
    };
    ProductsModel.update({'id':req.params.id}, {'$set': query}, (err,product)=>{
        res.redirect('/admin/products/detail/'+req.params.id); // redirect안하고 render할시 템플릿 product의 created_at에 걸린다
    });
});

//삭제
router.get('/products/delete/:id', (req,res)=>{
    ProductsModel.remove({'id' : req.params.id}, (err)=>{
        res.redirect('/admin/products');
    });
});

//댓글추가
router.post('/products/ajax_comment/insert', function(req,res){
    let comment = new CommentsModel({
        content : req.body.content,
        product_id : parseInt(req.body.product_id)
    });
    comment.save((err, comment)=>{
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});

//댓삭제
router.post('/products/ajax_comment/delete', function(req, res){
    CommentsModel.remove({ id : req.body.comment_id } , function(err){
        res.json({ message : "success" });
    });
});
module.exports = router;