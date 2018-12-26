const express = require('express');
const path = require('path'); // view위치잡아주려고 쓰는건가??

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
