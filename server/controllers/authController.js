const {User, ApiKey} = require('../models/userSchema'); // Import your User model
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const bcrypt = require('bcryptjs')
const Email = require('../utilities/email')
const express = require('express');
const rateLimit = require('express-rate-limit');
const {isTokenIncluded, getAccessTokenFromHeader, sendToken} = require('../utilities/tokenHelpers')
const asyncErrorWrapper = require("express-async-handler")
const catchAsync = require('../utilities/catchAsync')
const crypto = require('crypto')
const jwt = require("jsonwebtoken")

// Function to generate a unique API key
const apiKeyExpiration = new Date();
exports.generateUniqueApiKey = async(req, res) => {
  try{

    //1 set Expiry date to 3months
    apiKeyExpiration.setMonth(apiKeyExpiration.getMonth() + 3);

    //2 create new api key
    const apiKey = uuidv4();

    //3 use data to create api key and save to user apikeys array
    const newApiKey = new ApiKey({apiKey, apiKeyExpiration})
    req.user.apiKeys.push(newApiKey)
    await newApiKey.save()
    await req.user.save()

    //4 send response to client
    newApiKey.apiKey = apiKey
    res.status(200).json({
      status: 'success',
      newApiKey
    })

  }catch(errpr){
    res.status(500).json({
      status:'failed',
      errorMessage: error
    })
  }
};


// Function to register a new user and assign an API key
exports.registerUser = async (req, res) => {
    const { username, email, password} = req.body;

    const emailCheck = await User.findOne({ email }); 
      if (emailCheck) {
      res.status(400).json({ 
        status: 'failed',
        errorMessage: 'This email is already associated with an account' 
    });
    return
    }
    const userNameCheck = await User.findOne({ username }); 
    if (userNameCheck) {
        res.status(400).json({ 
            status: 'failed',
            errorMessage: 'This userName is already associated with an account' });
        return
      }
    try{

      const newUser = await User.create({
          username,
          email,
          password
      })
      const verificationToken = newUser.createToken()
      await newUser.save()
      new Email(newUser, verificationToken).sendConfirmEmail()
      res.status(200).json({
          status: 'success',
          message: 'account created successfully, please verify your email'
      })
    }catch(e){
      res.status(500).json({
          status: 'failed',
          errorMessage: e
      })
  }
};

exports.login  = async(req,res,next) => {

  //1 collect email or username as identity from req's body and password
  const { identity, password } = req.body
  
  // check if the data exists
  if(!identity && !password){
      res.status(400).json({
          status: 'failed',
          errorMessage: 'invalid email or password'
        })
  return
  };

  //3 check if email and password belongs to a user
  const user = await User.findOne(
      {$or: [{ email: identity }, 
          { username: identity }]})
          .select('+password');
 

  //4 use bcrypt to compare passwords 
  if(!user || !bcrypt.compareSync(password, user.password)){
    return res.status(401).json({
          status: 'failed',
          errorMessage: 'your email or password is incorrect'
        })
    }
  
  //5 check if email has been confirmed, if not create a verification token and send to user email
  if(user.emailStatus == 'pending'){
      const verificationToken = user.createToken()
      await user.save()
      new Email(user, verificationToken).sendConfirmEmail()
      res.status(401).json({
          status: 'failed',
          errorMessage: 'you have not verified your email, an email has been sent to you'
      })
      return
  }
 
  //6 finally on success send token to user
  sendToken(user ,200,res, 'successful');
  next()
  
}

exports.privateRouteProtect = async(req, res, next) => {
    try{
      //1 get your jwt personal secret
        const {JWT_SECRET_KEY} =process.env ;
        //2 ensure there is a token in the req
        if(!isTokenIncluded(req)) {
          
          return res.status(400).json({
            status: 'failed',
            errorMessage: 'No token added'
          })
        }
        //3 collect the token
        const accessToken = getAccessTokenFromHeader(req)
        
        //4 decode the token 
        const decoded = jwt.verify(accessToken,JWT_SECRET_KEY);
        
        //5 extract the payload of the decoded token and find user with the payload: 
        const user = await User.findById(decoded.id)
        
        //6 if there is no user send response to client
        if(!user) {
            return res.status(401).json({
              status: 'failed',
              errorMessage: 'You are not authorized to access this route'
            })
        }
      
      //7 finally if there is a user associated with the payload set the server's current user to the user that is grant access to route
        req.user = user ; 

    }catch(error){
        return res.status(500).json({
          status: 'failed',
          errorMessage: 'internal server error'
        })
      }
    next()

}

exports.apiKeyProtect = async(req, res, next) => {
  // extract apikey from req's parameters 
  const { apiKey, username } = req.params
  const salt = await bcrypt.genSalt(10)
  try{ 
  // hash token with the same salt/engine used to hash before saving
    const hashedKey = await bcrypt.hash(apiKey, salt)
    
    //1 find the user with the username in the req's parameters
    const user = await User.findOne({ username })
    //2 if there is no user send response to client
    if(!user){
      return res.status(404).json({
       status: 'failed',
       errorMessage: 'user not found' 
      })
    }

    //3 find the index the apiKey is at in the apiKeys' array
      const apikeyIndex = user.apiKeys.findIndex(obj => bcrypt.compare(obj.apiKey, hashedKey)) 
    //4 use bcrypt to compare the api key and the hashed key
      const isApiKeyValid = apikeyIndex === -1? null : bcrypt.compare(user.apiKeys[apikeyIndex].apiKey, hashedKey)
     
    //5 if the key is invalid, send response to client
      if(!isApiKeyValid || user.apiKeys[apikeyIndex].apiKeyExpiration <= new Date()){
        return res.status(401).json({
          status: 'failed',
          errorMessage: 'apikey is invalid or has expired'
        })
      }

    //6 check if apiKey is funded 
      if(user.apiKeys[apikeyIndex].apiKeyCredits <= 0 ){
        return res.status(401).json({
          status: 'failed',
          errorMessage: "Your balance is insufficient to complete this request"
        })
      }      

    //7 finally, grant access to user
        req.user = user
        next()
          }catch(err){
            return res.status(500).json({
              status: 'fail',
              errorMessage: `internal server error: ${err}`
            })
    }
}

exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute
  keyGenerator: (req) => {
    // Use the user object to identify the user
    return req.params.username; // Adjust this based on your user object structure
  },
});

exports.forgotpassword  = asyncErrorWrapper( async (req,res,next) => {
  const {URL,EMAIL_ACCOUNT} = process.env ; 

  const resetEmail = req.body.email  ;

  const user = await User.findOne({email : resetEmail})
  if(!user ) {
      return res.status(400)
      .json({
          success: true,
          errorMessage: "There is no user with that email"
      })
  }

  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save()  ;

  const resetPasswordUrl = `${URL}/resetpassword?resetPasswordToken=${resetPasswordToken}`

  try {

      new Email(user, resetPasswordUrl).sendPasswordReset()

      return res.status(200)
      .json({
          success: true,
          message: "Email Sent"
      })

  }

  catch(error ) {

      user.resetPasswordToken = undefined ;
      user.resetPasswordExpire = undefined  ;

      await user.save();
 
      res.status(500).json({
          status: 'failed',
          errorMessage: `internal server error`
      })
  }



})


exports.resetpassword  =asyncErrorWrapper(  async (req,res,next) => {
  
  const newPassword = req.body.newPassword || req.body.password
  
  const {resetPasswordToken} = req.query
  
  try{
      if(!resetPasswordToken) {
          res.status(400).json({
              status: 'failed',
              errorMessage: "Please provide a valid token"
          })
          return
      }
      
      const user = await User.findOne({
          resetPasswordToken :resetPasswordToken ,
          resetPasswordExpire : { $gt: Date.now() }
      })
      if(!user) {
          res.status(400).json({
              status: 'failed',
              errorMessage: "Invalid token or Session Expired"
          })
          return
      }
      
      user.password = newPassword ; 
      
      user.resetPasswordToken = undefined 
      user.resetPasswordExpire = undefined
      
      await user.save() ; 
      
      return res.status(200).json({
          success : 'success' ,
          message : "Reset Password successfull"
      })
      
  }catch(err){
      res.status(500).json({
          status: 'failed',
          errorMessage: `internal server error`
      })
  }
  })

exports.confirmEmailAndSignUp = catchAsync(async(req, res, next) => {
  const hashedToken = crypto.createHash('shake256').update(req.params.token).digest('hex')
  //1  get user based on token

  const user = await User.findOne({ 
     verificationToken: hashedToken,
     verificationTokenExpires: { $gt: Date.now() }
  })
  if(!user){
     res.status(400).json({
         status: 'failed',
         errorMessage: `this token is invalid or has expired`
  })
  return
 }
  //2 set verify user status to confirmed 
  user.emailStatus = 'confirmed'
  user.verificationToken = undefined
  user.verificationTokenExpires = undefined
  await user.save()
  
  try{
 //send welcome email to new user
 new Email(user, `${process.env.URL}/addstory`).sendWelcome()
 res.status(200).json({
     message: `Hi,
     Your email has been confirmed, and your account has been successfully created. You can now proceed to the dashboard.`,
 }) 
 return
} catch(e){
      res.status(404).json({
          status: 'failed',
          message: e.message
      })

}})
exports.resendVerificationToken = catchAsync(async(req, res, next) => {
  const hashedToken = crypto.createHash('shake256').update(req.params.token).digest('hex')
  const user = await User.findOne({ 
      verificationToken: hashedToken,
   })
   if(!user){
      res.status(400).json({
          status: 'failed',
          errorMessage: 'This token is associated with an account that has already been verified or was not generated by us. If you received this token from us, please proceed to log in.'
   })
   return
  }
  const verificationToken = user.createToken()
  await user.save()
  await new Email(user, verificationToken).sendConfirmEmail()
  res.status(200).json({
      status: "success",
      message: "An email has been sent to your inbox for verification. Please proceed to verify your email.",
    });
})