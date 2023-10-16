const express = require('express');
const router = express.Router();
const { getVerifiedCertificates } = require('../controllers/AllVerifiedCertificates'); // Import the controller
const verify = require('../Controllers/verifytoken');

// Define a route to get verified certificates for the authenticated user
router.get('/certificates/verified',verify, getVerifiedCertificates);

module.exports = router;
