const {Router} = require('express');
const {
      createCertificateRequest,getCertificateRequestsByUser,deleteCertificateRequest,getCertificateRequestsByInstitution,
      updateCertificateStatusToVerified,updateCertificateStatusToRejected,
      getCertificateRequestsCount,
      getAllPendingCertificateRequestsCount,getAllVerifiedCertificateRequestsCount,getAllRejectedCertificateRequestsCount,getAllCertificateCount,
      getCertificateRequestsByStatusAndInstitution,
      getLatestCertificateRequestsByStatusAndInstitution,
      getLatestCertificateRequestsByStatusForAllInstitutions,
      countCertificateRequestsForAllInstitutions,
      getCertificateRequestsByStatusForAllInstitutions
      } 
      = require('../controllers/CertificateRequest');

const verify = require('../Controllers/verifytoken');
const router = Router();

//User
router.post('/createCertificateRequest/:institutionID/:formID/:certificateID',verify, createCertificateRequest);
router.get('/getCertificateRequestsByUser',verify, getCertificateRequestsByUser);
router.delete('/deleteCertificateRequest/:requestID',verify, deleteCertificateRequest);

//Institution(Admin)
router.get('/certificateRequestsByInstitution', verify, getCertificateRequestsByInstitution);
router.put('/updateCertificateStatusToVerified/:requestID', verify, updateCertificateStatusToVerified);
router.put('/updateCertificateStatusToRejected/:requestID', verify, updateCertificateStatusToRejected);
router.get('/getCertificateRequestsByStatusAndInstitution/:status', verify, getCertificateRequestsByStatusAndInstitution);
router.get('/getLatestCertificateRequestsByStatusAndInstitution/:status', verify, getLatestCertificateRequestsByStatusAndInstitution);
router.get('/getLatestCertificateRequestsByStatusForAllInstitutions/:status', getLatestCertificateRequestsByStatusForAllInstitutions);
router.get('/getCertificateRequestsByStatusForAllInstitutions/:status',  getCertificateRequestsByStatusForAllInstitutions);


router.get('/getCertificateRequestsCount', verify, getCertificateRequestsCount);
router.get('/countCertificateRequestsForAllInstitutions', countCertificateRequestsForAllInstitutions);


//SuperAdmin
router.get('/getAllPendingCertificateRequestsCount', verify, getAllPendingCertificateRequestsCount);
router.get('/getAllVerifiedCertificateRequestsCount', verify, getAllVerifiedCertificateRequestsCount);
router.get('/getAllRejectedCertificateRequestsCount', verify, getAllRejectedCertificateRequestsCount);
router.get('/getAllCertificateCount', verify, getAllCertificateCount);




module.exports = router;