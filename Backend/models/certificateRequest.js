const mongoose = require('mongoose');
const InstitutionModel = require('../models/institution');
const UserModel = require('../models/user');
const CertificateModel = require('../models/certificate');
const FormModel = require('../models/form');



const CertificateRequestSchema = new mongoose.Schema({
  studentID:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: async function (value) {
                const userExists = await UserModel.exists({ _id: value });
                return userExists;
            },
            message: 'User does not exist.'
        }
  },

  institutionID: {
    type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        validate: {
            validator: async function (value) {
                const institutionExists = await InstitutionModel.exists({ _id: value });
                return institutionExists;
            },
            message: 'Institution does not exist.'
        }
  },
  formID:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomizableForm',
        validate: {
            validator: async function (value) {
                const formExists = await FormModel.exists({ _id: value });
                return formExists;
            },
            message: 'CustomizableForm does not exist.'
        }
  },
  certificateID:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        validate: {
            validator: async function (value) {
                const certificateExists = await CertificateModel.exists({ _id: value });
                return certificateExists;
            },
            message: 'Certificate does not exist.'
        }
  },
   status:{
    type:String,
    default:'Pending',
   },
   reason:{
    type:String,
   },
   credentialUrl:{
    type:String
   }

},{ timestamps: true });

const CertificateRequest = mongoose.model('CertificateRequest', CertificateRequestSchema);

module.exports = CertificateRequest;
