const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Institution = require("../models/institution");
const nodeMailer = require('nodemailer');


// Function to generate a random password of a given length
function generateRandomPassword(minLength, maxLength) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const passwordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}


//create institution
const createInstitution = asyncHandler(async (req, res) => {
  try {

    // Check if the email already exists in the database
    const existingInstitution = await Institution.findOne({ email: req.body.email });

    if (existingInstitution) {
      // Send a specific error response for duplicate email
      return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
    }
      // Generate a random password with a minimum length of 6 characters
      const password = generateRandomPassword(6, 12);

      // Hash the generated password
      const hashedPassword = await bcrypt.hash(password, 10);

        // Create the institution with the generated password
        const institution = await Institution.create({
            name: req.body.name,
            location: req.body.location,
            email: req.body.email,
            password: hashedPassword, // Store the hashed password
        });

      // Check if the institution was successfully created
      if (institution) {
          const transporter = nodeMailer.createTransport({
              service: 'gmail',
              auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
              }
          });

          const mailOptions = {
              from: process.env.EMAIL_USER,
              to: institution.email,
              subject: 'Your Institution Account Information',
              text: ` Your email: ${institution.email} and password: ${password}`
          };

          transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                  console.error(err);
                  res.status(400).json(err);
              } else {
                  console.log("Email sent: " + info.response);
                  res.status(201).json({
                      message: "Institution created successfully",
                      institution,
                  });
              }
          });
      } else {
          // Handle the case where institution creation failed
          res.status(500).json({ message: "Error creating institution" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error creating institution", error });
  }
});



const loginInstitution = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    const institution = await Institution.findOne({ email });
    //compare password with hashedpassword
    if (institution &&   await bcrypt.compare(password, institution.password)) {
      const accessToken = jwt.sign(
        {
            institution: {
            email: institution.email,
            id: institution._id,
            role:institution.role
          },
        },
        process.env.ACCESS,
        { expiresIn: "1d" }
      );
      res.status(200).json({ institution,accessToken });
    } else {
      res.status(401).json({ error: "Email or Password is not valid" });
    }
  });

  // Delete an institution by ID
const deleteInstitutionById = asyncHandler(async (req, res) => {
  try {
      const institutionID = req.params.institutionID;

      // Check if the institution with the given ID exists
      const institution = await Institution.findById(institutionID);

      if (!institution) {
          return res.status(404).json({ message: "Institution not found" });
      }

      // Delete the institution using deleteOne
      await Institution.deleteOne({ _id: institutionID });

      res.status(200).json({ message: "Institution deleted successfully" });
  } catch (error) {
      console.error("Error deleting institution:", error);
      res.status(500).json({ message: "Error deleting institution", error: error.message });
  }
});


// Update an institution by ID
const updateInstitutionById = asyncHandler(async (req, res) => {
  try {
      const institutionID = req.params.institutionID;
      const updateData = req.body; // Data to update the institution

      // Check if the institution with the given ID exists
      const institution = await Institution.findById(institutionID);

      if (!institution) {
          return res.status(404).json({ message: "Institution not found" });
      }

      // Check if the updateData contains a new password
      if (updateData.password) {
          // Hash the new password
        //   const hashedPassword = await bcrypt.hash(updateData.password, 10);
        //   updateData.password = hashedPassword;
      }

      // Update the institution's data
      Object.assign(institution, updateData);

      // Save the updated institution to the database
      await institution.save();

      res.status(200).json({ message: "Institution updated successfully", institution });
  } catch (error) {
      console.error("Error updating institution:", error);
      res.status(500).json({ message: "Error updating institution", error: error.message });
  }
});

// Get all institutions
const getAllInstitutions = asyncHandler(async (req, res) => {
  try {
      const institutions = await Institution.find();

      if (!institutions || institutions.length === 0) {
          return res.status(404).json({ message: "No institutions found" });
      }

      res.status(200).json({
          message: "Institutions retrieved successfully",
          institutions,
      });
  } catch (error) {
      console.error("Error retrieving institutions:", error);
      res.status(500).json({ message: "Error retrieving institutions", error: error.message });
  }
});

// Get an institution by ID
const getInstitutionById = asyncHandler(async (req, res) => {
  try {
    const institutionID = req.user.institution.id;

    // Check if the institution with the given ID exists
    const institution = await Institution.findById(institutionID);

    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    res.status(200).json({ message: "Institution retrieved successfully", institution });
  } catch (error) {
    console.error("Error retrieving institution:", error);
    res.status(500).json({ message: "Error retrieving institution", error: error.message });
  }
});

// Update the password and set notified to true for an institution by ID
const updateInstitutionPasswordById = asyncHandler(async (req, res) => {
  try {
    const institutionID = req.user.institution.id;
    const { newPassword } = req.body;

    // Check if the institution with the given ID exists
    const institution = await Institution.findById(institutionID);

    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the institution's password and set notified to true in the database
    institution.password = hashedPassword;
    institution.notified = true;
    
    // Save the updated institution document
    await institution.save();

    res.status(200).json({ message: 'Password updated successfully', institution });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});

// Get the last three institutions
const getLastThreeInstitutions = asyncHandler(async (req, res) => {
  try {
    const institutions = await Institution.find({role: 'admin'})
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (newest first)
      .limit(3); // Limit the result to three institutions

    res.status(200).json({
      message: "Last three institutions retrieved successfully",
      institutions,
    });
  } catch (error) {
    console.error("Error retrieving last three institutions:", error);
    res.status(500).json({
      message: "Error retrieving last three institutions",
      error: error.message,
    });
  }
});


const countTotalInstitutions = async () => {
  try {
    // Count the total number of institutions where role is 'admin' in the Institution collection
    const totalAdminInstitutions = await Institution.countDocuments({ role: 'admin' });

    return totalAdminInstitutions;
  } catch (error) {
    console.error('Error counting total admin institutions:', error);
    return 0; // Return 0 in case of an error
  }
};

// Controller to get the total count of institutions
const getTotalInstitutions = asyncHandler(async (req, res) => {
  try {
    // Get the total number of institutions
    const totalInstitutions = await countTotalInstitutions();

    res.status(200).json({ total: totalInstitutions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving total institutions', error });
  }
});

const getAllLocations = async (req, res) => {
  try {
    // Query the database to find all institutions
    const institutions = await Institution.find({role: 'admin'}, 'location');

    // Create a Set to store unique locations
    const uniqueLocations = new Set();

    // Iterate through the institutions and add their locations to the Set
    institutions.forEach((institution) => {
      uniqueLocations.add(institution.location);
    });

    // Convert the Set back into an array
    const locations = Array.from(uniqueLocations);

    // Send the unique locations as a JSON response
    res.status(200).json(locations);
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching institution locations.' });
  }
};


const getInstitutionsByLocation = async (req, res) => {
  const { location } = req.params; // Assuming the location is passed as a parameter in the URL

  try {
    let query = { role: 'admin' }; // Include the role filter for "admin" institutions

    if (location !== "All") {
      // If the location is not "All," include it in the query
      query.location = location;
    }

    // Query the database to find admin institutions based on the query
    const institutions = await Institution.find(query);

    // Send the matching admin institutions as a JSON response
    res.status(200).json(institutions);
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching admin institutions by location.' });
  }
};



module.exports = {
  getLastThreeInstitutions,createInstitution,getInstitutionsByLocation,getAllLocations,loginInstitution,deleteInstitutionById,updateInstitutionById,getAllInstitutions,getInstitutionById,updateInstitutionPasswordById,getTotalInstitutions
};
