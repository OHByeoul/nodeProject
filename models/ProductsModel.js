const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {autoIncrement} = require('mongoose-plugin-autoinc');


//생성될 필드명을 정한다.
const ProductsSchema = new Schema({
    name : { //제품명
        type : String,
        required : [true, '제목을 입력해주세요']
    },
    thumbnail : String,
    price : Number, //가격
    description : String, //설명
    created_at : { //작성일
        type : Date,
        default : Date.now()
    }
});

ProductsSchema.virtual('getDate').get(function(){
    let date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    }
});

// 1씩 증가하는 primary Key를 만든다
// model : 생성할 Collection 이름
// field : primary key , startAt : 1부터 시작
ProductsSchema.plugin(autoIncrement, {model:'products',field:'id',startAt : 1});
module.exports = mongoose.model('products',ProductsSchema);