var User = require("../users");
var passport = require("passport");
const express = require("express");
var passportJWT = require("passport-jwt");
var Config = require("../Config");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
const router = express.Router();
const jwtWeb = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oidc");

var params = {
  secretOrKey: Config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = async () => {
  var strategy = new Strategy(params, async function (payload, done) {
    // User.findById(payload.id, function(err,user){
    //     if(err){
    //         return done(new Error("User not found"), null);

    //     }else if(payload.expire <= Date.now()){
    //         return done (new Error ('Token is Expired'), null )
    //     }else{
    //         return done(null,user);
    //     }
    // })

    let user = await User.findById(payload.id);
    if (!user) {
      return done(new Error("User not found"), null);
    } else if (payload.expire <= Date.now()) {
      return done(new Error("User not found"), null);
    } else {
      return done(null, user);
    }
  });
  passport.use(strategy);
  return {
    initialize: function () {
      return passport.initialize();
    },
  };
};

//routes for google strategy
router.post("/save-user", async (req, res) => {
  const userData = req.body;
  try {
    const newUser = new User(userData);
    await newUser.save();
    res.json({ message: "User data saved successfully" });
  } catch (err) {
    console.error("Eror saving user data", err);
    res.status(500).json({ error: "failed to send user data" });
  }
});

module.exports = router;
