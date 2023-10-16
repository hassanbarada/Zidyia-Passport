const {Router} = require('express');
const {registerUser,upload, loginUser,forgot,reset,updateProfile,verifyEmail,
    getUserPhoto,getcertificaterequestoruploaded,getTotalUserCount,getUser
    ,getAllUsers,getUserCertificateCounts,getUserIDPhoto,BlockUser,UnblockUser} = require('../controllers/AuthController');
//const { verify } = require('jsonwebtoken');
const verify = require('../Controllers/verifytoken');


const router = Router();

router.post('/register', upload.fields([{ name: 'profilePicture' }, { name: 'ID' }]), registerUser);
router.post('/login', loginUser);
router.post('/forgot-password',forgot);
router.post('/reset-password/:id/:token',reset);
router.put('/updateProfile/:id',upload.single('profilePicture'),updateProfile);
router.get('/users/:id/verify/:token',verifyEmail)
router.get("/getTotalUserCount", getTotalUserCount);
router.get('/user/find/:id',verify ,getUser );
router.get('/getAllUsers',getAllUsers );
router.get('/getUserCertificateCounts/:id',verify ,getUserCertificateCounts );

//Get User  Photo
router.get("/getUserPhoto/:userUploadID/photo", getUserPhoto);
router.get("/getcertificaterequestoruploaded", verify,getcertificaterequestoruploaded);
router.get("/getUserIDPhoto/:userUploadID", getUserIDPhoto);

router.put('/BlockUser/:userId',BlockUser);
router.put('/UnblockUser/:userId',UnblockUser);

module.exports = router;