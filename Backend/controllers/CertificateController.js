const Certificate = require('../models/certificate');
const path = require('path');
const multer = require ('multer');
const fs = require('fs');
const CertificateRequest = require('../models/certificateRequest');
const CertificateUpload = require('../models/certificateUpload');
const Student = require('../models/user');

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

const getCertificatePhoto = async (req, res) => {
  try {
    const certificatePhoto = await Certificate.findById(req.params.certificatePhotoID);
    if (!certificatePhoto) {
      return res.status(404).json({ error: 'certificatePhoto not found.' });
    }

    const relativeImagePath = certificatePhoto.image;

    const absoluteImagePath = path.join(uploadPath, relativeImagePath);

    
    if (!fs.existsSync(absoluteImagePath)) {
      return res.status(404).json({ error: 'File not found.', imagePath: absoluteImagePath });
    }

    
    res.sendFile(absoluteImagePath);
  } catch (err) {
    
    console.error('Error retrieving certificateUpload photo:', err);

    
    res.status(500).json({ error: 'Internal Server Error', errorMessage: err.message });
  }
};

const createCertificate = async (req, res) => {
  try {
    const { name, description } = req.body;
    const institutionID = req.user.institution.id;

    // Check if req.file exists (uploaded image)
    if (!req.file) {
      console.log('No file uploaded'); // Add this log
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('Received file:', req.file); // Add this log to see file details

    const certificate = new Certificate({
      name,
      description,
      image: req.file.filename, // Save the filename in the database
      institutionID,
    });

    console.log('Certificate data:', certificate); // Add this log to see certificate data

    await certificate.save();

    console.log('Certificate saved successfully'); // Add this log

    res.status(201).json({ certificate });
  } catch (error) {
    console.error('Error:', error); // Add this log to see any errors
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get a list of certificates for an institution (requires a valid token with institutionID)
const getCertificates = async (req, res) => {
  try {
    // Extract the institutionID from the token
    
    const institutionID = req.user.institution.id;

    const certificates = await Certificate.find({ institutionID });

    res.status(200).json({ certificates });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get a list of certificates for an institution (requires a valid token with institutionID)
const getCertificatesbyInstitution = async (req, res) => {
  try {
    // Extract the institutionID from the token
    
    const institutionID = req.params.institutionID;

    const certificates = await Certificate.find({ institutionID });

    res.status(200).json({ certificates });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update a certificate by ID (requires a valid token with institutionID)
const updateCertificateById = async (req, res) => {
  try {
    const certificateID = req.params.certificateID;
    const { name, description, image } = req.body;

    // Extract the institutionID from the token
    const institutionID = req.user.institution.id;


    // Check if the certificate with the given ID exists and belongs to the institution
    const certificate = await Certificate.findOne({ _id: certificateID, institutionID });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Update the certificate's data
    certificate.name = name;
    certificate.description = description;
    certificate.image = image;

    await certificate.save();

    res.status(200).json({ certificate });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a certificate by ID (requires a valid token with institutionID)
const deleteCertificateById = async (req, res) => {
  try {
    const certificateID = req.params.certificateID;

    // Extract the institutionID from the token
    const institutionID = req.user.institution.id;


    // Check if the certificate with the given ID exists and belongs to the institution
    const certificate = await Certificate.findOne({ _id: certificateID, institutionID });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Delete the certificate
    await Certificate.deleteOne({ _id: certificateID });

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const countTotalCertificates = async (req, res) => {
  try {
    // Extract the institutionID from the token
    const institutionID = req.user.institution.id;

    // Count the number of certificates for the institution
    const totalCertificates = await Certificate.countDocuments({ institutionID });

    res.status(200).json({ totalCertificates });
  } catch (error) {
    console.error('Error counting total certificates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const calculateAverageCertificates = async (req, res) => {
  try {
    // Extract the institutionID from the token
    const institutionID = req.user.institution.id;

    // Count the total number of certificates for the specific institution
    const certificatesForInstitution = await Certificate.countDocuments({ institutionID });

    // Count the total number of certificates across all institutions
    const totalCertificates = await Certificate.countDocuments();

    if (totalCertificates === 0) {
      // Handle the case where there are no certificates in the system
      return res.status(200).json({ average: 0 });
    }

    // Calculate the average as a percentage and round it to one decimal place
    const average = ((certificatesForInstitution / totalCertificates) * 100).toFixed(1);

    res.status(200).json({ average: parseFloat(average) }); // Convert it back to a float

  } catch (error) {
    console.error('Error calculating average certificates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const countTotalCertificatesForAllInstitutions = async (req, res) => {
  try {
    // Count the total number of certificates for all institutions
    const totalCertificates = await Certificate.countDocuments();

    res.status(200).json({ totalCertificates });
  } catch (error) {
    console.error('Error counting total certificates for all institutions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getStudentCountsForInstitution = async (req, res) => {
  try {
    // Extract the institutionID from req.user
    const institutionID = req.user.institution.id;

    // Get the distinct user IDs who have requested certificates
    const requestedStudents = await CertificateRequest.distinct('studentID', {
      institutionID: institutionID,
    });

    // Get the distinct user IDs who have uploaded certificates and exclude those who have requested certificates
    const uploadedStudents = await CertificateUpload.distinct('studentID', {
      institutionID: institutionID,
      studentID: { $nin: requestedStudents }, // Exclude students who have requested certificates
    });

    // Calculate the total student count
    const totalStudentCount = requestedStudents.length + uploadedStudents.length;

    res.status(200).json({ totalStudentCount });
  } catch (error) {
    console.error('Error counting total students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStudentAverageForInstitution = async (req, res) => {
  try {
    // Extract the institutionID from req.user
    const institutionID = req.user.institution.id;

    // Get the distinct user IDs who have requested certificates
    const requestedStudents = await CertificateRequest.distinct('studentID', {
      institutionID: institutionID,
    });

    // Get the distinct user IDs who have uploaded certificates and exclude those who have requested certificates
    const uploadedStudents = await CertificateUpload.distinct('studentID', {
      institutionID: institutionID,
      studentID: { $nin: requestedStudents },
    });

    // Calculate the total student count for the specific institution
    const totalStudentCountForInstitution = requestedStudents.length + uploadedStudents.length;

    // Get the total number of students in the system
    const totalStudentsInSystem = await Student.countDocuments();

    if (totalStudentsInSystem === 0) {
      return res.status(200).json({ average: 0 });
    }

    // Calculate the average
    const average = ((totalStudentCountForInstitution / totalStudentsInSystem) * 100).toFixed(1);

    res.status(200).json({ average });
  } catch (error) {
    console.error('Error calculating average students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};








module.exports = {
  countTotalCertificates,
  createCertificate,
  getCertificates,
  updateCertificateById,
  deleteCertificateById,
  upload,
  getCertificatePhoto,
  getCertificatesbyInstitution,
  getStudentCountsForInstitution,
  countTotalCertificatesForAllInstitutions,
  calculateAverageCertificates,
  getStudentAverageForInstitution
};
