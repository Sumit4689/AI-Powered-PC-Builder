const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const userValidation = require('../validation/userValidation');

const loginUser = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    res.status(200).json({
        message: 'User logged in successfully'
    })
})

module.exports = loginUser;