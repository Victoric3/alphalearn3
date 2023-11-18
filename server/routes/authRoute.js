const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post("/registerUser", authController.registerUser);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotpassword);
router.patch("/resetpassword", authController.resetpassword);
router.post("/confirmEmailAndSignUp/:token", authController.confirmEmailAndSignUp);


router.patch("/generateUniqueApiKey", authController.privateRouteProtect, authController.generateUniqueApiKey);
router.get("/resendVerificationToken", authController.resendVerificationToken);

module.exports = router;
