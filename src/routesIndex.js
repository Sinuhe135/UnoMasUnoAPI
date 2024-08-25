const express = require('express');
const router = express.Router();

const userRoute = require('./modules/user/routes.js');
const authRoute = require('./modules/auth/routes.js');
const branchRoute = require('./modules/branch/routes.js');
const studentRoute = require('./modules/student/routes.js');

router.use('/api/users',userRoute);
router.use('/api/auth',authRoute);
router.use('/api/branches',branchRoute);
router.use('/api/students',studentRoute);

module.exports = router;