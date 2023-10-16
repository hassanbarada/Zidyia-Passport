const express = require("express");
const asyncHandler = require("express-async-handler");
const {storeFormValues,getFormValuesByStudentAndCertificateID} = require("../controllers/FormValuesController");
const verify = require('../Controllers/verifytoken');

const router = express.Router();

// Create a route handler to store input values
router.post(
  "/store-values/:formID/:certificateID/:certificateRequestID", verify ,storeFormValues
);
router.get('/getFormValuesByStudentID/:studentID/:certificateID/:certificateRequestID',getFormValuesByStudentAndCertificateID)

module.exports = router;
