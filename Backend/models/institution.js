const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
        //unique: true, // Add unique index to enforce uniqueness
    },
    location:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        unique: [true, 'Email address must be unique.'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.']
    },
    password:{

    },
    role: {
        type: String,
        enum: ['admin', 'superAdmin'], // Define the allowed enum values
        default: 'admin', // Set the default value to 'admin'
    },
    notified:{
        type: Boolean, 
        default: false,
    }
   
},{ timestamps: true }
);


const InstitutionModel = mongoose.model('Institution', InstitutionSchema);


module.exports = InstitutionModel;
