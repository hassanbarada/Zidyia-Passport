const mongoose = require('mongoose');
const FormModel = require('../models/form');
const UserModel = require('../models/user');
const Certificate = require('../models/certificate');
const CertificateRequest = require('../models/certificateRequest');

const FormValuesSchema = new mongoose.Schema({
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function (value) {
        const userExists = await UserModel.exists({ _id: value });
        return userExists;
      },
      message: 'User does not exist.',
    },
  },
  formID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomizableForm',
    validate: {
      validator: async function (value) {
        const formExists = await FormModel.exists({ _id: value });
        return formExists;
      },
      message: 'Form does not exist.',
    },
  },
  certificateID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    validate: {
      validator: async function (value) {
        const formExists = await Certificate.exists({ _id: value });
        return formExists;
      },
      message: 'Certificate does not exist.',
    },
  },
  certificateRequestID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CertificateRequest',
    required: true,
    validate: {
      validator: async function (value) {
        const formExists = await CertificateRequest.exists({ _id: value });
        return formExists;
      },
      message: 'CertificateRequest does not exist.',
    },
  },
  dynamicFields: [
    {
      key: String, 
      value: mongoose.Schema.Types.Mixed,
    },
  ],
});

const FormValues = mongoose.model('FormValues', FormValuesSchema);

module.exports = FormValues;
