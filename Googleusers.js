const express = require('express')
const mongoose = require('mongoose')




 const GoogleuserSchema = new mongoose.Schema({
googleId: String,
email:String,
name:String,


 })

 const User = mongoose.model('User', GoogleuserSchema)
 
module.exports = User;