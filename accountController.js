const User = require('./users')
const Config = require('./Config')
const jwt = require('jwt-simple')
const session = require("express-session");
const passport = require('passport')




exports.login = function(req,res){
  User.findOne({username : req.body.username})
  .then(user =>{
    if(!user){
      return res.status(404).json({error : 'User not found'})
    }
    var payload = {
      id:user.id,
      expire:Date.now() + 1000 * 60 * 60 * 24 * 7
    };
    var token = jwt.encode(payload, Config.jwtSecret)
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.json({token:token});
  })
  .catch(err =>{
    console.error('Error finding user', err);
    res.status(500).json({error: 'Interval server error'})
  })
}

exports.register = async function(req,res){
  try{
const existingUser = await User.findOne({username:req.body.username})
// if the username exists return an error message

if(existingUser){
  return res.status(400).send({message:'Username already exists'})
}

  }catch(error){
    res.status(500).send({message:'Internal server error'})
  }
  User.register(
    new User({
      email:req.body.email,
      username:req.body.username
    }), req.body.password, function(err,msg){

      if(err){
        res.send(err)
      }else{
        res.send({message : 'Successful'})
      }
    }
  )
}



exports.profile = function(req,res){
  const tokenFromquery = req.query.secret_token
  console.log('Token received from query:', tokenFromquery)
  if(tokenFromquery){
    try{
      const decodedtoken = jwt.decode(tokenFromquery, Config.jwtSecret)
      console.log('Decoded token:', decodedtoken)
    }catch(err){
      console.error('Error loading token')
    }
  }else{
    console.log('No token received from query parameters')
  }
  res.json({
  message:'You made it to the secured profile',
user:req.user,
token: req.query.secret_token
  })
}

//Google strategy account controller

