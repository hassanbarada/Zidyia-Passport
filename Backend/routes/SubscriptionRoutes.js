const {Router} = require('express');
const {createsubscription,getAllSubscriptions,getSubscriptionById,updateSubscriptionPassword
    ,updateSubscriptionStatusToVerified,loginSubscription,getTotalSubscribers,
    getAverageVerifiedAndExpiredSubscribers
} = require('../controllers/SubscriptionController');
const verify = require('../controllers/verifytoken');




const router = Router();

router.post('/createsubscription', createsubscription);
router.get('/getAllSubscriptions', getAllSubscriptions);
router.put('/updateSubscriptionStatusToVerified/:subscriptionID', updateSubscriptionStatusToVerified);
router.post('/loginSubscription', loginSubscription);
router.get('/countTotalSubscribers', getTotalSubscribers);
router.get('/getSubscriptionById',verify, getSubscriptionById);
router.put('/updateSubscriptionPassword',verify, updateSubscriptionPassword);
router.get('/getAverageVerifiedAndExpiredSubscribers', getAverageVerifiedAndExpiredSubscribers);



module.exports = router;