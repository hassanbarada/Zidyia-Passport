// const asyncHandler = require("express-async-handler");
const CertificateUpload = require("../models/certificateUpload");
const InstitutionModel=require("../models/institution");
const path = require('path');
const multer = require ('multer');
const asyncHandler = require("express-async-handler");
const fs = require('fs');



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



const getCertificateUploadPhoto = async (req, res) => {
  try {
    const certificateUpload = await CertificateUpload.findById(req.params.certificateUploadID);
    if (!certificateUpload) {
      return res.status(404).json({ error: 'certificateUpload not found.' });
    }

    // Use the imagePath directly as it should be a relative path
    const relativeImagePath = certificateUpload.certificateFile;

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
    console.error('Error retrieving certificateUpload photo:', err);

    // Respond with a more detailed error message
    res.status(500).json({ error: 'Internal Server Error', errorMessage: err.message });
  }
};



// Create a new certificate upload
const createCertificateUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Certificate file is missing.' });
    }
    const studentID = req.user.user.id;
    const { name } = req.body; 
    // Get the institution ID from the request parameters
    const { institutionID } = req.params;
    const certificateFile = req.file;
    const certificateUpload = new CertificateUpload({
      name,
      studentID,
      institutionID,
      description: req.body.description,
      certificateFile: certificateFile.filename,
    });
    // const certificateUpload = new CertificateUpload(req.body);
    await certificateUpload.save();
    res.status(201).json(certificateUpload);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a list of all certificate uploads for a specific institution
const getCertificateUploadsByInstitution = asyncHandler(async (req, res) => {
  try {
    // Extract the institution ID from the JWT token
    const institutionIDFromToken = req.user.institution.id;

    // Find certificate uploads that match the institution ID
    const certificateUploads = await CertificateUpload.find({
      institutionID: institutionIDFromToken,
    });

    res.status(200).json({
      message: "Certificate uploads retrieved successfully",
      certificateUploads,
    });
  } catch (error) {
    console.error("Error retrieving certificate uploads:", error);
    res.status(500).json({
      message: "Error retrieving certificate uploads",
      error: error.message,
    });
  }
});


const getCertificateUploadsByInstitutionCount = asyncHandler(async (req, res) => {
  try {
    // Extract the institution ID from the JWT token
    const institutionIDFromToken = req.user.institution.id;

    // Count certificates with pending status for the institution
    const pendingCount = await CertificateUpload.countDocuments({
      institutionID: institutionIDFromToken,
      status: 'Pending', // Replace with your specific status value
    });

    // Count certificates with rejected status for the institution
    const rejectedCount = await CertificateUpload.countDocuments({
      institutionID: institutionIDFromToken,
      status: 'Rejected', // Replace with your specific status value
    });

    // Count certificates with approved status for the institution
    const approvedCount = await CertificateUpload.countDocuments({
      institutionID: institutionIDFromToken,
      status: 'Approved', // Replace with your specific status value
    });
    const totalCount = await CertificateUpload.countDocuments({
      institutionID: institutionIDFromToken,
    });
    res.status(200).json({
      message: "Certificate uploads retrieved successfully",
      certificateCounts: {
        Pending: pendingCount,
        Rejected: rejectedCount,
        Approved: approvedCount,
        totalCertificates: totalCount,
      },
    });
  } catch (error) {
    console.error("Error retrieving certificate uploads:", error);
    res.status(500).json({
      message: "Error retrieving certificate uploads",
      error: error.message,
    });
  }
});


const getCertificateUploadsTotal = asyncHandler(async (req, res) => {
  try {
    // Count all certificate uploads in the database
    const totalCount = await CertificateUpload.countDocuments();

    res.status(200).json({
      message: "Total certificate uploads retrieved successfully",
      totalCertificates: totalCount,
    });
  } catch (error) {
    console.error("Error retrieving total certificate uploads:", error);
    res.status(500).json({
      message: "Error retrieving total certificate uploads",
      error: error.message,
    });
  }
});




// Get a single certificate upload by ID
const getCertificateUploadById = async (req, res) => {
  try {
    const certificateUpload = await CertificateUpload.findById(req.params.id);
    if (!certificateUpload) {
      return res.status(404).json({ error: 'Certificate upload not found' });
    }
    res.json(certificateUpload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a certificate upload by ID
const updateCertificateUploadById = async (req, res) => {
  try {
    const certificateUpload = await CertificateUpload.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!certificateUpload) {
      return res.status(404).json({ error: 'Certificate upload not found' });
    }
    res.json(certificateUpload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a certificate upload by ID
const deleteCertificateUploadById = async (req, res) => {
  try {
    const certificateUpload = await CertificateUpload.findByIdAndRemove(
      req.params.id
    );
    if (!certificateUpload) {
      return res.status(404).json({ error: 'Certificate upload not found' });
    }
    res.json({ message: 'Certificate upload deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUploadRequestsByStatusAndInstitution = async (req, res) => {
  try {
    const institutionID = req.user.institution.id; // Get the institution ID from the token
    const { status } = req.params; // Get the status from the URL parameter

    // Validate if the institution exists
    const institutionExists = await InstitutionModel.exists({ _id: institutionID });

    if (!institutionExists) {
      return res.status(404).json({ message: 'Institution does not exist.' });
    }

    // Define valid status values (you can customize this)
    const validStatusValues = ['Pending', 'Approved', 'Rejected', 'All'];

    // Check if the provided status is valid
    if (!validStatusValues.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    let query = { institutionID };

    // Handle the case when status is "All"
    if (status !== 'All') {
      query.status = status;
    }

    // Find certificate requests based on the query and populate the 'user' and 'certificate' fields
    const certificateRequests = await CertificateUpload.find(query)
      .populate('studentID') // Populate the 'user' field
      

    res.status(200).json(certificateRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUploadRequestsByStatusForAllInstitutions = async (req, res) => {
  try {
    const { status } = req.params; // Get the status from the URL parameter

    // Validate the status
    const validStatusValues = ['Pending', 'Approved', 'Rejected', 'All'];
    if (!validStatusValues.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Create a query based on the status (including the case for "All")
    const query = status === 'All' ? {} : { status };

    // Find upload requests based on the query and populate the 'student' field
    const certificateUploads = await CertificateUpload.find(query)
      .populate('studentID') // Populate the 'student' field
      .populate('institutionID')

    res.status(200).json(certificateUploads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateuploadCertificateStatusToVerified = async (req, res) => {
  try {
    const { requestID } = req.params;
    const institutionID = req.user.institution.id;

    const credentialUrl = `/CredentialUrl/${requestID}`;

    // Find the certificate request by ID, institution ID, and update its status
    const updatedRequest = await CertificateUpload.findOneAndUpdate(
      { _id: requestID, institutionID },
      { 
        status: 'Approved',
        credentialUrl: credentialUrl
      },
      { new: true } // To get the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Certificate upload not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Certificate upload status updated to verified.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateuploadCertificateStatusToRejected = async (req, res) => {
  try {
    const { requestID } = req.params;
    const institutionID = req.user.institution.id;
    const {  reason } = req.body;

    // Find the certificate request by ID, institution ID, and update its status
    const updatedRequest = await CertificateUpload.findOneAndUpdate(
      { _id: requestID, institutionID },
      { status: 'Rejected',reason },
      { new: true } // To get the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Certificate request not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Certificate request status updated to rejected.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllInstitutionsCertificateUploadCounts = asyncHandler(async (req, res) => {
  try {
    // Count certificates with pending status for all institutions
    const pendingCount = await CertificateUpload.countDocuments({
      status: 'Pending', // Replace with your specific status value
    });

    // Count certificates with rejected status for all institutions
    const rejectedCount = await CertificateUpload.countDocuments({
      status: 'Rejected', // Replace with your specific status value
    });

    // Count certificates with approved status for all institutions
    const approvedCount = await CertificateUpload.countDocuments({
      status: 'Approved', // Replace with your specific status value
    });

    // Count total certificates for all institutions
    const totalCount = await CertificateUpload.countDocuments();

    res.status(200).json({
      message: "Certificate uploads retrieved successfully",
      certificateCounts: {
        Pending: pendingCount,
        Rejected: rejectedCount,
        Approved: approvedCount,
        totalCertificates: totalCount,
      },
    });
  } catch (error) {
    console.error("Error retrieving certificate uploads:", error);
    res.status(500).json({
      message: "Error retrieving certificate uploads",
      error: error.message,
    });
  }
});





module.exports = {
  createCertificateUpload,
  getCertificateUploadsByInstitution,
  getCertificateUploadById,
  updateCertificateUploadById,
  deleteCertificateUploadById,
  getCertificateUploadsByInstitutionCount,
  getCertificateUploadsTotal,
  getCertificateUploadPhoto,
  getUploadRequestsByStatusAndInstitution,
  updateuploadCertificateStatusToVerified,
  updateuploadCertificateStatusToRejected,
  getAllInstitutionsCertificateUploadCounts,
  getUploadRequestsByStatusForAllInstitutions,
  upload
};

