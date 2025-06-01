const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

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

    const token = jwt.sign(
        {id: user._id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '12d'}
    );

    res.status(200).json({
        message: 'User logged in successfully',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin  // Make sure this is included
        }
    });
})

module.exports = loginUser;