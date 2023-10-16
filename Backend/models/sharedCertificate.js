const mongoose = require('mongoose');
const SubscriptionModel = require('./subscription');
const CertificateUploadModel = require('./certificateUpload');
const CertificateRequestModel = require('./certificateRequest');
const UserModel = require('../models/user');

const SharedCertificateSchema = new mongoose.Schema({
    subscriberID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        validate: {
            validator: async function (value) {
                const subscriptionExists = await SubscriptionModel.exists({ _id: value });
                return subscriptionExists;
            },
            message: 'Subscription does not exist.'
        }
    },
    certificateUploadID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CertificateUpload',
        validate: {
            validator: async function (value) {
                // Validate against the CertificateUpload model
                const certificateUploadExists = await CertificateUploadModel.exists({ _id: value });
                return certificateUploadExists;
            },
            message: 'CertificateUpload does not exist.'
        }
    },
    certificateRequestID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CertificateRequest',
        validate: {
            validator: async function (value) {
                // Validate against the CertificateRequest model
                const certificateRequestExists = await CertificateRequestModel.exists({ _id: value });
                return certificateRequestExists;
            },
            message: 'CertificateRequest does not exist.'
        }
    },
    studentID: {
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
    qrcode: {
        type: String
    },
    qrUrl: {
        type: String
    }
}, { timestamps: true });



const SharedCertificateModel = mongoose.model('SharedCertificate', SharedCertificateSchema);

module.exports = SharedCertificateModel;
