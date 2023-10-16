const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodeMailer = require('nodemailer');
const User = require("../models/user");
const path = require('path');
const multer = require ('multer');
const fs = require('fs');
const Token = require('../models/token');
const emailVerification = require('../controllers/verificationEmail');
const crypto = require('crypto');
const CertificateRequest = require('../models/certificateRequest');
const CertificateUpload = require('../models/certificateUpload');
const SharedCertificate=require('../models/sharedCertificate');

// Construct the full path to the uploads directory
const uploadPath = path.join(__dirname, '..', 'server', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      console.log('Uploading files ...');
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath); // Remove the extra concatenation here
    } catch (error) {
      console.error('Error:', error.message);
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, `${Date.now()}-${file.originalname}`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
});

const upload = multer({ storage: storage });

const getUserPhoto = async (req, res) => {
  try {
    const userUpload = await User.findById(req.params.userUploadID);
    if (!userUpload) {
      return res.status(404).json({ error: 'user not found.' });
    }

    // Use the imagePath directly as it should be a relative path
    const relativeImagePath = userUpload.profilePicture;

    // Get the absolute path to the image file
    const absoluteImagePath = path.join(uploadPath, relativeImagePath);

    // Check if the file exists
    if (!fs.existsSync(absoluteImagePath)) {
      return res.status(404).json({ error: 'File not found.', imagePath: absoluteImagePath });
    }

    // Send the product's photo as a response
    res.sendFile(absoluteImagePath);
  } catch (err) {
    // Log the error including the error message and stack trace
    console.error('Error retrieving user photo:', err);

    // Respond with a more detailed error message
    res.status(500).json({ error: 'Internal Server Error', errorMessage: err.message });
  }
};


const getUserIDPhoto = async (req, res) => {
  try {
    const userUpload = await User.findById(req.params.userUploadID);
    if (!userUpload) {
      return res.status(404).json({ error: 'user not found.' });
    }

    // Use the imagePath directly as it should be a relative path
    const relativeImagePath = userUpload.ID;

    // Get the absolute path to the image file
    const absoluteImagePath = path.join(uploadPath, relativeImagePath);

    // Check if the file exists
    if (!fs.existsSync(absoluteImagePath)) {
      return res.status(404).json({ error: 'File not found.', imagePath: absoluteImagePath });
    }

    // Send the product's photo as a response
    res.sendFile(absoluteImagePath);
  } catch (err) {
    // Log the error including the error message and stack trace
    console.error('Error retrieving userID photo:', err);

    // Respond with a more detailed error message
    res.status(500).json({ error: 'Internal Server Error', errorMessage: err.message });
  }
};

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstname, lastname, email, password, bio, location } = req.body;

    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({ error: "All fields are mandatory!" });
      return;
    }

    const emailUser = await User.findOne({ email });

    if (emailUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = firstname + " " + lastname;

    
    let profilePictureFilename = null; 
    if (req.files.profilePicture && req.files.profilePicture[0]) {
      profilePictureFilename = req.files.profilePicture[0].filename;
    }

    
    const { ID } = req.files;
    const user = await User.create({
      ID: ID[0].filename,
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profilePicture: profilePictureFilename,
      bio,
      location,
    });

    if (!user) {
      res.status(400).json({ error: "User data is not valid" });
      return;
    }

    // Create the verification token
    const token = await Token.create({
      userID: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    if (!token) {
      res.status(500).json({ error: "Token creation failed" });
      return;
    }

    // Generate the verification URL and send the email
    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    await emailVerification(user.email, "Verify Email", url);

    res
      .status(201)
      .json({ message: "An Email has been sent to your account. Please verify." });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Registration failed" });
  }
}); 



// update profile
const updateProfile = asyncHandler(async (req, res) => {
  const {  location, bio } = req.body;
  const userId = req.params.id; 

  // Check if profilePicture is provided
  let profilePictureFilename = null; // Default value if not provided
  if (req.file) {
    profilePictureFilename = req.file.filename;
  }


  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

     if (profilePictureFilename) {
      user.profilePicture = profilePictureFilename;
    }

    if (location) {
      user.location = location;
    }

    if (bio) {
      user.bio = bio;
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ error: "Profile update failed" });
  }
});

const verifyEmail = async (req, res) => {
  try {
    const userId = req.params.id;
    const tokenValue = req.params.token;

    // Find the user by ID
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "Invalid link: User not found" });
    }

    // Find the corresponding token and delete it
    await Token.deleteOne({
      userID: user._id,
      token: tokenValue,
    });

    // Update the user's verification status
    await User.updateOne({ _id: user._id }, { verified: true });

    res.status(200).json({ message: "Email verified" });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (!user.verified) {
      try {
       
        return res.status(400).json({ message: "Please Verify your Account" });
      } catch (error) {
        return res.status(500).json({ error: "Email verification failed" });
      }
    }

    const accessToken = jwt.sign(
      {
        user: {
          email: user.email,
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS,
      { expiresIn: "1d" }
    );
    res.status(200).json({ user, accessToken });
  } else {
    res.status(401).json({ error: "Email or Password is not valid" });
  }
});


const forgot = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      {
        user: {
          email: user.email,
          id: user._id,
          role: user.role
        },
      },
      process.env.ACCESS,
      { expiresIn: '1d' }
    );

    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password Link',
      text: `http://localhost:3000/reset_password/${user._id}/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send reset email' });
      } else {
        return res.status(200).json({ message: 'Reset email sent successfully' });
      }
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



const reset = asyncHandler(async (req, res) =>  {
  const {id, token} = req.params
  const {password} = req.body

  jwt.verify(token,process.env.ACCESS, (err, decoded) => {
      if(err) {
          return res.json({Status: "Error with token"})
      } else {
          bcrypt.hash(password, 10)
          .then(hash => {
              User.findByIdAndUpdate({_id: id}, {password: hash})
              .then(u => res.send({Status: "Success"}))
              .catch(err => res.send({Status: err}))
          })
          .catch(err => res.send({Status: err}))
      }
  })
})

const getcertificaterequestoruploaded= asyncHandler(async (req, res) => {
  const userId = req.user.user.id;

  try {
    // Fetch requested certificates for the user
    const requestedCertificates = await CertificateRequest.find({ studentID: userId }).populate('certificateID').populate('institutionID');

    // Fetch uploaded certificates for the user
    const uploadedCertificates = await CertificateUpload.find({ studentID: userId }).populate('institutionID');

    res.json({ requestedCertificates, uploadedCertificates });
  } catch (error) {
    console.error(error);
  }
});
  
const getTotalUserCount = asyncHandler(async (req, res) => {
  try {
    // Count the total number of users in the User collection
    const totalUsers = await User.countDocuments();

    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error counting total users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//get user
const getUser = async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (req.user.user.id === userID || req.user.user.isAdmin) {
      try{
  await User.findById(userID);
    const { password, ...info } = user._doc;
    res.status(200).json(info);}catch (err) {
      res.status(500).json(err);
    }}else {
      res.status(403).json({ error: 'You can find the user on your account or you must be an admin.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserCertificateCounts = async (req, res) => {
  try {
    if (req.user.user.id === req.params.id) {
      const userId = req.params.id;
      const uploadedCertificatesCount = await CertificateUpload.countDocuments({ studentID: userId });
      const requestedCertificatesCount = await CertificateRequest.countDocuments({ studentID: userId });
      const sharedCertificatesCount = await SharedCertificate.countDocuments({ studentID: userId });

      const result = {
        uploadedCertificatesCount,
        requestedCertificatesCount,
        sharedCertificatesCount,
      };

      res.status(200).json(result);
    } else {
      res.status(403).json({ error: 'User from token does not match studentID in request.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching certificate counts: ' + error.message });
  }
};

const BlockUser= async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndUpdate(userId, { isblocked: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Route to unblock a user
const UnblockUser= async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndUpdate(userId, { isblocked: false });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { registerUser, loginUser,upload,forgot,reset,updateProfile,verifyEmail,getUserIDPhoto,
  getUserPhoto,getcertificaterequestoruploaded,getTotalUserCount,getUser,getAllUsers,getUserCertificateCounts,BlockUser,UnblockUser};


