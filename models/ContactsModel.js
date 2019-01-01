const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {autoIncrement} = require('mongoose-plugin-autoinc');

const ContactsSchema = new Schema({
    title : String,
    content : String,
    name : String,
    created_at : {
        type : Date,
        default : Date.now()
    }
});

ContactsSchema.virtual('getDate').get(function(){
    let date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    }
});

ContactsSchema.plugin(autoIncrement, {model:'contacts', field:'id',startAt:1});
module.exports = mongoose.model('contacts',ContactsSchema);