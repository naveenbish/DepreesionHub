const express = require('express'); 
const zod = require('zod');
const userModel = require('../db')
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcrypt'); 
const path = require('path');
const authMiddleware = require('../middleware')


// Zod schema for validation
const userSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(2),
    firstName: zod.string().min(2),
    lastName: zod.string().min(2),
    profilePic: zod.string().optional(),
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Signup API
router.post('/signup', upload.single('profilePic'), async (req, res) => {
    const { username, password, firstName, lastName } = req.body;
    const profilePicPath = req.file ? req.file.path : ''; // Handle the file path
    const validationResult = userSchema.safeParse({
        username,
        password,
        firstName,
        lastName,
        profilePic: profilePicPath,
    });

    if (!validationResult.success) {
        console.log(validationResult.error);
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        });
    }

    const userExists = await userModel.findOne({ username });
    if (userExists) {
        return res.status(404).json({
            success: false,
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
        ...validationResult.data,
        password: hashedPassword,
    });


    const token = jwt.sign({ id: newUser._id }, "secretToken");
    return res.status(200).json({
        success: true,
        newUser,
        token
    });
});

// Signin API
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const userExists = await userModel.findOne({ username });
    if (!userExists) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        }).status(400);
    }
    const comparePassword = await bycyrpt.compare(password,userExist.password)
    if(!comparePassword){
        return res.json({
            success:false,
            message:"User's password does not match"
        }).status(400)
    }
    const token = jwt.sign({ id: userExists._id }, "secretToken");
    return res.status(200).json({
        success: true,
        message: "Successfully signed in",
        token
    });
});

// Profile picture upload API (if needed as separate)
router.post('/upload-profile-pic', upload.single('profilePic'), (req
, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Save the file path or URL to your user's database record here
    res.send('File uploaded successfully.');
});

// Update user info API
router.put('/updateInfo', async (req, res) => {
    const { username, password, firstName, lastName, profilePic } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User does not exist"
        });
    }

    try {
        const updateData = {
            firstName,
            lastName,
            profilePic
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await userModel.findOneAndUpdate({ username }, updateData, { new: true });
        return res.status(200).json({
            success: true,
            updatedUser
        });
    } catch (error) {
        return res.json({
            success: false,
            error: error.message
        }).status(500); 
    }
});

router.post('/bulk',async(req,res)=>{
    const  { filter } = req.body ?? ""
    const users = await userModel.find({
        $or:[
            {
            firstName:{$regex:filter,$options:'i'}
            },{
            lastName:{$regex:filter,$options:'i'}
            }
        ]
        })
    if(!users){
    return res.json({
            status:true,
            message:"No Users Found"
        }).status(200)
    }
    return res.json({
        success:true,
        users
    }).status(200)
})


router.get('/fetchDetails',authMiddleware, async(req,res)=>{
    const user = await userModel.findById(req.userID)
    if(!user){
        return res.json({
            success:false,
            message:"Could not find user details"
        }).status(400)
    }
    return res.json({
        success:true,
        user
    }).status(200)

})
router.post('/fetchAnyUser',authMiddleware, async(req,res)=>{
    const user = await userModel.findById(req.body.userID)
    if(!user){
        return res.json({
            success:false,
            message:"Could not find user details"
        }).status(400)
    }
    return res.json({
        success:true,
        user
    }).status(200)

})




module.exports = router; 