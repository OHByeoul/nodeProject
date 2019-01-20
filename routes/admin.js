const express = require('express');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel');
const CommentsModel = require('../models/CommentsModel');

//csrf 셋팅
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true}); //토큰이 발행됬던 페이지에서 작성한 사람만 db에 저장하도록

//이미지 저장위치 셋팅
const path = require('path');
const uploadDir = path.join(__dirname,'../uploads'); //루트의 uploads위치에 저장
const fs = require('fs'); //삭제할때 내장모듈 사용하기 위해

//multer 셋팅
const multer = require('multer');
const storage = multer.diskStorage({
    destination : function(req,file, callback) {
        callback(null, uploadDir);
    },
    filename : function(req,file, callback){
        callback(null, 'products-'+Date.now()+'.'+file.mimetype.split('/')[1]);
    }
});
const upload = multer({storage : storage});

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
router.get('/products/write', csrfProtection, function(req,res){
    res.render('admin/form', {'product' : "", csrfToken : req.csrfToken() }); // 수정과 같은 템플릿을 사용하기 때문에 뒤에 빈 값을 추가해준다.
});

router.post('/products/write', upload.single('thumbnail'), csrfProtection, (req,res)=>{
    //console.log(req.file);
    var product = new ProductsModel({
        name : req.body.name,
        price : req.body.price,
        thumbnail : (req.file) ? req.file.filename : "",
        description : req.body.description
    });
    let validationError = product.validateSync();
    console.log(validationError);
    if(!validationError){
        product.save(function(err){
            res.redirect('/admin/products');
        });
    }
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

router.get('/products/edit/:id', csrfProtection, (req,res)=>{ 
    ProductsModel.findOne({'id' : req.params.id}, (err,product)=>{
        res.render('admin/form', {'product' : product, 'csrfToken' : req.csrfToken()});
    });
});

router.post('/products/edit/:id', upload.single('thumbnail'), csrfProtection, (req,res)=>{ //upload.single('thumbnail') 미들웨어를 넣으므로 req.file사용가능
    ProductsModel.findOne({id: req.params.id}, (err,product)=>{
        if(req.file && product.thumbnail){ // 요청중에 파일존재시 이전 이미지 삭제 그전파일이 잇을때
            fs.unlinkSync(uploadDir+'/'+product.thumbnail);
        }
        let query = {
            name : req.body.name,
            thumbnail : (req.file) ? req.file.filename : product.thumbnail,
            price : req.body.price,
            description : req.body.description,
        };
        ProductsModel.update({'id':req.params.id}, {'$set': query}, (err,product)=>{
            res.redirect('/admin/products/detail/'+req.params.id); // redirect안하고 render할시 템플릿 product의 created_at에 걸린다
        });
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