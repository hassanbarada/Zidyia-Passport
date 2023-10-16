const {Router} = require('express');
const verify = require('../Controllers/verifytoken');
const {addCustomizableForm,getCustomizableFormByInstitution,deleteCustomizableFormByInstitution,updateCustomizableFormByInstitution}= require('../controllers/FormController');

const router = Router();

router.post('/createCustomizableForm',verify, addCustomizableForm);
router.get('/getCustomizableFormByInstitution/:institutionID', getCustomizableFormByInstitution)
router.delete('/deleteCustomizableFormByInstitution',verify,deleteCustomizableFormByInstitution);
router.put('/updateCustomizableFormByInstitution',verify,updateCustomizableFormByInstitution);



module.exports = router;