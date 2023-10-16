const jwt = require("jsonwebtoken");
const CertificateUpload = require("../models/certificateUpload");
const CertificateRequest = require("../models/certificateRequest");


const getVerifiedCertificates = async (req, res) => {
  
  const studentID = req.user.user.id;

  try {
    // Query for verified CertificateUploads and CertificateRequests
    const verifiedCertificateUploads = await CertificateUpload.find({
      studentID,
      status: "Approved",
    });

    const verifiedCertificateRequests = await CertificateRequest.find({
      studentID,
      status: "Approved",
    }).populate("certificateID");

    // Return the results as JSON response
    res.status(200).json({
      certificateUploads: verifiedCertificateUploads,
      certificateRequests: verifiedCertificateRequests,
    });
  } catch (error) {
    // Handle any errors, e.g., database errors
    console.error("Error fetching verified certificates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getVerifiedCertificates };
