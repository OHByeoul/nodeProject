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

ContactsSchema.plugin(autoIncrement, {model:'contacts', field:'id',startAt:1});
module.exports = mongoose.model('contacts',ContactsSchema);