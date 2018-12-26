const express = require('express');
const path = require('path'); // view위치잡아주려고 쓰는건가??

//MongoDB 접속
const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', ()=>{
    console.log('mongodb connect');
});

mongoose.connect('mongodb://127.0.0.1:27017/shoppingmall',{ useMongoClient: true });
//
const admin = require('./routes/admin');
const app = express();
const port = 3000;

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs')

app.get('/', (req,res)=>{
    res.send('firstttt app');
});

app.use('/admin',admin);

app.listen(port, ()=>{
    console.log('Express listening on port', port);
});
