const jwt = require('jsonwebtoken')

const extractUserInfo = (req,res,next)=>{
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({message:'No token provided'})
    }

    jwt.verify(token, 'Michael', (err,decodedToken)=>{
        if(err){
            return res.status(401).json({message:'Invalid Token'})
        }

        req.user = decodedToken
        next()
    })
}

module.exports = extractUserInfo