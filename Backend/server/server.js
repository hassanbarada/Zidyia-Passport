const express=require('express');
const authRoute=require('../routes/AuthRoutes');
const intitutionRoute = require('../routes/InstitutionRoutes')
const formRoute = require('../routes/FormRoutes');
const subscriptionRoute = require('../routes/SubscriptionRoutes');
const certificateRoute = require('../routes/CertificateRoutes');
const certificateUploadRoute = require('../routes/CertificateUploadRoutes');
const mailRoute = require('../routes/MailRoutes');
const CertificateRequest=require('../routes/CertificateRequestRoute');
const FormValuesRoute=require('../routes/FormValuesRoute');
const sharedCertificateRoutes = require('../routes/SharedCertificateRoutes'); 


const AllVerifiedCertificates = require('../routes/AllVerifiedCertificates')
const connect = require('./connect');
const cors=require('cors');
require('dotenv').config();
const app=express();






app.use(express.json(),cors());
app.use(authRoute,intitutionRoute,formRoute,sharedCertificateRoutes,CertificateRequest,subscriptionRoute,certificateRoute,certificateUploadRoute,mailRoute,FormValuesRoute,AllVerifiedCertificates)

app.listen(process.env.PORT,function(){
    connect();
    console.log(`Server started on port ${process.env.PORT}`);
})