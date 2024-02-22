const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
title:{
type:String,
required:true,

},

thumbnail:{
    type:String,

},
slug:{
    type:String
},
description:{
    type:String
},
stars:{
    type:Number
},
category:{
    type:[String]
},
createdAt:{
    type:Date,
    default:Date.now()
},

isBookmarked:{
    type:Boolean, default:false,
},
userId: {
    type: String,
    ref: 'user',
    required: true,
  },
movieId:{
    type:mongoose.Schema.Types.ObjectId,
   
}

})

module.exports = mongoose.model('Movie', MovieSchema)