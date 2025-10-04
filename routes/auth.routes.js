const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller'); // ✅ add this line

// ✅ Use the functions correctly
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.delete('/delete/:userId', authCtrl.deleteAccount); // ✅ correct param name
router.patch('/update-password/:userId', authCtrl.updatePassword);


module.exports = router;
