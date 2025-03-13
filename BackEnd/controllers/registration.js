const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const userValidation = require('../validation/userValidation');

const registerUser = asyncHandler(async (req, res)=>{
    const validation = userValidation.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({
            message: validation.error.errors
        })
    }

    const {name, email, password} = req.body;

    const exsitingUser = await User.findOne({email})
    if(exsitingUser){
        return res.status(400).json({
            message: 'User already exists'
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if(user){
            res.status(201).json({
                message : 'User registered successfully',
            })
        }else{
            res.status(400).json({
                message : 'Invalid user data'
            })
        }
    }catch(error){
        return res.status(500).json({
            message: 'Failed to register user Server error'
        })
    }
})

module.exports = registerUser;
