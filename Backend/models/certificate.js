const mongoose = require('mongoose');
const InstitutionModel = require('../models/institution');



const CertificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  institutionID: {
    type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        validate: {
            validator: async function (value) {
                const institutionExists = await InstitutionModel.exists({ _id: value });
                return institutionExists;
            },
            message: 'User does not exist.'
        }
  }
  
},{ timestamps: true });

const Certificate = mongoose.model('Certificate', CertificateSchema);

module.exports = Certificate;
