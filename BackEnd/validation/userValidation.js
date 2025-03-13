const zod = require('zod');

const userValidation = zod.object({
    name : zod.string()
    .min(3, "Name must be at least 3 character long")
    .max(50, "Name must be at most 50 character long"),
    email : zod.string().email("Invalid email format"),
    password : zod.string()
    .min(6, "Password must be at least 6 character long")
    .max(50,"Password must be at most 50 character long")
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
})

module.exports = userValidation;