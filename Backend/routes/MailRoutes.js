const {Router} = require('express');
const sendEmail = require('../controllers/MailController');

const router = Router();

router.post('/sendEmail', sendEmail);

module.exports = router;