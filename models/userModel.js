const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
   type: String, 
   required: [true,'Name is required']
  },
  email: { 
  	type: String, 
  	required: [true,'Email is required'], 
  	unique: true,
  	lowercase: true
  },
  password: { 
  	type: String, 
  	required: [true,'Password is required'], 
  	minlength: 8
  },
  type: { 
    type: String, 
    required: [true,'User type is required']
  }
});

userSchema.methods.confirmPassword = async function(inputPassword,userPassword)
{
  return await bcrypt.compare(inputPassword,userPassword);
};

const User = mongoose.model('users',userSchema);
module.exports = User;