const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const CertificateUploadController = require('../controllers/CertificateUploadController');
const verify = require('../Controllers/verifytoken');
const {upload} = require('../controllers/CertificateUploadController');


// Create a new certificate upload
router.post('/certificateUploadRoute/:institutionID', verify, upload.single('certificateFile'), CertificateUploadController.createCertificateUpload);

// Get a list of all certificate uploads
router.get('/certificateUploadRoute',verify, CertificateUploadController.getCertificateUploadsByInstitution);

router.get('/certificateUploadRoute/count',verify, CertificateUploadController.getCertificateUploadsByInstitutionCount);

router.get('/getAllInstitutionsCertificateUploadCounts/count' , CertificateUploadController.getAllInstitutionsCertificateUploadCounts);


router.get('/certificateUploadRoute/totalcount',verify, CertificateUploadController.getCertificateUploadsTotal);

// Get a single certificate upload by ID
router.get('/certificateUploadRoute/:id', CertificateUploadController.getCertificateUploadById);

// Update a certificate upload by ID
router.put('/certificateUploadRoute/:id', CertificateUploadController.updateCertificateUploadById);

// Delete a certificate upload by ID
router.delete('/certificateUploadRoute/:id', CertificateUploadController.deleteCertificateUploadById);

//Get certificate Upload Photo
router.get("/certificateUploadPhoto/:certificateUploadID/photo", CertificateUploadController.getCertificateUploadPhoto);

router.get('/getUploadRequestsByStatusAndInstitution/:status', verify, CertificateUploadController.getUploadRequestsByStatusAndInstitution);
router.get('/getUploadRequestsByStatusForAllInstitutions/:status',  CertificateUploadController.getUploadRequestsByStatusForAllInstitutions);


router.put('/updateuploadCertificateStatusToVerified/:requestID', verify, CertificateUploadController.updateuploadCertificateStatusToVerified);

router.put('/updateuploadCertificateStatusToRejected/:requestID', verify, CertificateUploadController.updateuploadCertificateStatusToRejected);



module.exports = router;
