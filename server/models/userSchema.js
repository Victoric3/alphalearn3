const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const { Schema } = mongoose;
const crypto = require('crypto')
const jwt = require("jsonwebtoken")


const apiKeySchema = new Schema({
  apiKey: {
    type: String,
    required: true,
    unique: true,
  },
  apiKeyCredits: {
    type: Number,
    default: 0
  },
  apiKeyExpiration: {
    type: Date,
    required: true
  },
  tier: {
    type: Number,
    default: 1
  },
})
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "your email is required"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  emailStatus : {
    type: String,
    default: 'pending',
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  verificationToken : {
      type: String,
      default: ""
  },
  verificationTokenExpires : {
      type: Number,
      default: -1
  },
  apiKeys: [apiKeySchema]
  
});
userSchema.pre("save" , async function (next) {

  if (!this.isModified("password")) {
      next()
  }

  const salt = await bcrypt.genSalt(10)
  
  this.password = await bcrypt.hash(this.password,salt)
  next() ;
  
})
apiKeySchema.pre("save" , async function (next) {

  const salt = await bcrypt.genSalt(10)
  
  this.apiKey = await bcrypt.hash(this.apiKey,salt)
  this.apiKeyExpiration = new Date().getMonth + 3
  next() ;
  
})
userSchema.methods.generateJwtFromUser  = function(){
    
  const { JWT_SECRET_KEY,JWT_EXPIRE } = process.env;

  payload = {
      id: this._id,
      username : this.username,
      email : this.email
  }

  const token = jwt.sign(payload ,JWT_SECRET_KEY, {expiresIn :JWT_EXPIRE} )

  return token 
}

userSchema.methods.getResetPasswordTokenFromUser =function(){

  const randomHexString = crypto.randomBytes(20).toString("hex")

  const resetPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest("hex")

  this.resetPasswordToken = resetPasswordToken
  
  this.resetPasswordExpire = Date.now() + 1200000

  return resetPasswordToken
}

userSchema.methods.createToken = function(){
  const verificationToken = crypto.randomBytes(32).toString('hex')
  //hash the reset token

  this.verificationToken = crypto.createHash('shake256').update(verificationToken).digest('hex')
  this.verificationTokenExpires = Date.now() + 20 * 60 * 1000;
  return verificationToken
}

const User = mongoose.model('User', userSchema);
const ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = {User, ApiKey};
