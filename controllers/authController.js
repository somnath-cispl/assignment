const {promisify} = require('util');
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
  
  try{
		const {email,password} = req.body;
		const user = await User.findOne({email}).select('+password');
    if(user){
      const confirm = await user.confirmPassword(password,user.password);
      if(!confirm){
        return res.status(200).json({
          status: false,
          message: "Invalid Credentials!"
        });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
      const cookieOption = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN
          ),
        secure: true,
        httpOnly: true
      };
      res.cookie('jwt',token,cookieOption);
      return res.status(200).json({
        status : true,
        message : '',
        data : {
          token,
          user:{
            "email": user.email,
            "name": user.name,
            "type": user.type
          }
        }
      });
    }else{
      res.status(200).json({
        status: false,
        message: 'Invalid Credentials!',
        data:""
      });
    }
	}catch(err){
		return res.status(200).json({
			status: false,
			message: "Something went wrong please try again later!",
      data:""
		});
	}
};

exports.authorizeAdmin = async (req, res, next) => {
  
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return res.status(200).json({
      status: false,
      message: 'You are not authorize to take this action!',
      data:""
    });
  }

  try{
    const tokenValue = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    const userDetails = await User.findById(tokenValue.id);
    if(userDetails && userDetails.type == 'admin'){
      next();
    }else{
      return res.status(200).json({
        status: false,
        message: "You are not authorize to take this action!",
        data:""
      });
    }
  }catch(err){
    return res.status(200).json({
      status: false,
      message: err.message,
      data:""
    });
  }
};

exports.authorizeUser = async (req, res, next) => {
  
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return res.status(200).json({
      status: false,
      message: 'You are not authorize to take this action!',
      data:""
    });
  }

  try{
    const tokenValue = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    const userDetails = await User.findById(tokenValue.id);
    if(userDetails && userDetails.type == 'user'){
      next();
    }else{
      return res.status(200).json({
        status: false,
        message: "You are not authorize to take this action!",
        data:""
      });
    }
  }catch(err){
    return res.status(200).json({
      status: false,
      message: err.message,
      data:""
    });
  }
};

exports.logout = (req, res) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return res.status(200).json({
      status: false,
      message: 'You are not authorize to take this action!',
      data: ''
    });
  }
  // jwt.destroy(token);
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  return res.status(200).json({
    status: true,
    message: '',
    data: ''
  });
}

exports.validateToken = async (req, res) => {
  
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return res.status(200).json({
      status: false,
      message: '',
      data: ''
    });
  }
  const tokenValue = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  const userDetails = await User.findById(tokenValue.id);
  if(userDetails){
    return res.status(200).json({
      status: true,
      message: '',
      data: {
        user:{
          "email": userDetails.email,
          "name" : userDetails.name,
          "type" : userDetails.type
        }
      }
    });
  }else{
    return res.status(200).json({
      status: false,
      message: 'Please login again!',
      data: ''
    });
  }
}
