const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('admin app')
});

router.get('/products', (req,res)=>{
    res.render('admin/products',{
        "message" :"Hi",
        "message2":"Hello"
    }); //render를 사용하면 자동으로 views아래의 폴더를 인식함

})

module.exports = router;