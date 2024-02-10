const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
title:{
type:String,
required:true,

},

slug:{
    type:String,

},
description:{
    type:String
},
thumbnail:{
    type:String
},
createdAt:{
    type:Date,
    default:Date.now()
}


})

module.exports = mongoose.model('Movie', MovieSchema)