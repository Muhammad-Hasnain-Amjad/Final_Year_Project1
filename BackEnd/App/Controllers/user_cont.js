const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usermodel = require("../Models/usermodel.js");
const lawyermodel = require("../Models/Lawyermodel.js"); // ← ADD THIS IMPORT
const validator = require('validator');

// Token function
function Genusertoken(id, role) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret key is missing!");
    return jwt.sign(
        { 
            id: id,
            type: role || "User"
        }, 
        secret,
        { expiresIn: '7d' }
    );
}

// Login user (works for admin now)
async function loginUser(req, res) {
    try {
        const { email, password, role } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({
                status: false,
                message: "Please enter a valid email"
            });
        }

        let user = null;
        let userRole = role || "user";

        // Check different models based on role
        if (userRole === 'admin') {
            user = await usermodel.findOne({ email, role: 'admin' });
        } else if (userRole === 'lawyer') {
            user = await lawyermodel.findOne({ "registration.email": email });
        } else {
            user = await usermodel.findOne({ email });
        }

        if (!user) {
            return res.json({
                status: false,
                message: "User not found"
            });
        }

        // Get password based on model structure
        let userPassword;
        let userId;
        let userName;
        
        if (userRole === 'lawyer') {
            userPassword = user.registration.password;
            userId = user._id;
            userName = user.registration.fullName;
        } else {
            userPassword = user.password;
            userId = user._id;
            userName = user.name;
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, userPassword);

        if (!isPasswordCorrect) {
            return res.json({
                status: false,
                message: "Invalid Password"
            });
        }

        // Generate token
        const usertoken = Genusertoken(userId, userRole);

        // Success response
        return res.json({
            status: true,
            usertoken,
            name: userName,
            id: userId,
            email: email,
            role: userRole
        });

    } catch (e) {
        console.error(e);
        return res.json({
            status: false,
            message: e.message
        });
    }
}

// ✅ FIXED: Reset password with proper hashing for ALL roles
async function resetPassword(req, res) {
    try {
        const { email, newPassword, role } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and new password are required" 
            });
        }

        let user;
        let userModel = role === 'lawyer' ? 'lawyer' : 'user';

        // Find user based on role
        if (role === 'admin') {
            user = await usermodel.findOne({ email, role: 'admin' });
        } else if (role === 'lawyer') {
            user = await lawyermodel.findOne({ "registration.email": email });
        } else {
            user = await usermodel.findOne({ email });
        }
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // ✅ HASH the new password (same as registration)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password based on role
        if (role === 'admin') {
            user.password = hashedPassword;
        } else if (role === 'lawyer') {
            user.registration.password = hashedPassword; // ← NOW HASHED!
        } else {
            user.password = hashedPassword;
        }
        
        await user.save();
        
        console.log(`✅ Password reset successfully for ${email} (${role})`);
        
        res.json({ 
            success: true, 
            message: "Password reset successful" 
        });
        
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error: " + error.message 
        });
    }
}

// Verify email exists (add this endpoint)
async function verifyEmail(req, res) {
    try {
        const { email, role } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is required" 
            });
        }

        let user;
        
        if (role === 'admin') {
            user = await usermodel.findOne({ email, role: 'admin' });
        } else if (role === 'lawyer') {
            user = await lawyermodel.findOne({ "registration.email": email });
        } else {
            user = await usermodel.findOne({ email });
        }
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Email not found" 
            });
        }
        
        res.json({ 
            success: true, 
            message: "Email verified" 
        });
        
    } catch (error) {
        console.error("Verify email error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
}

// Register user
async function registerUser(req, res) {
    try {
        let { name, email, password, role } = req.body;
        
        let exist = await usermodel.findOne({ email });
        if (exist) {
            return res.json({ status: false, message: "User Already Exist" });
        }
        
        if (!validator.isEmail(email)) {
            return res.json({ status: false, message: "Please Enter Valid Email" });
        }
        
        if (password.length < 8) {
            return res.json({ status: false, message: "Enter at least 8 characters" });
        }
        
        let salt = await bcrypt.genSalt(10);
        let newpassword = await bcrypt.hash(password, salt);
        
        let user = await usermodel({
            name, email,
            password: newpassword,
            role: role || "user"
        });
        
        let newuser = await user.save();
        let usertoken = Genusertoken(newuser._id, newuser.role);
        
        return res.json({ status: true, usertoken });
        
    } catch (e) {
        console.log(e.toString());
        return res.json({ status: false, message: "Error" });
    }
}

async function allusers(req, res) {
    let allusers = await usermodel.find();
    return res.json({ status: true, allusers });
}

module.exports = { 
    loginUser, 
    registerUser, 
    allusers, 
    resetPassword,
    verifyEmail  // ← ADD THIS
};