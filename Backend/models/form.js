const mongoose = require('mongoose');
const InstitutionModel = require('../models/institution');

const formFieldSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    required: true,
    enum: ['text', 'number', 'email','Date'],
  },
  isRequired: {
    type: Boolean,
    required: true,
  },
});

const customizableFormSchema = new mongoose.Schema({
  formName: {
    type: String,
    default:"Certificate Request Form",
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
  fields: [formFieldSchema],
});

const CustomizableForm = mongoose.model('CustomizableForm', customizableFormSchema);

module.exports = CustomizableForm;
