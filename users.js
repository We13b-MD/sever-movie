const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
username:{
type:String,
required:true,
unique:false
},
email:{
    type:String,
    required:false,
    unique:false
}

});

UserSchema.plugin(passportLocalMongoose);
const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel;
