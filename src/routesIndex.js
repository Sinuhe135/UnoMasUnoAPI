const express = require('express');
const router = express.Router();

const userRoute = require('./modules/user/routes.js');
const authRoute = require('./modules/auth/routes.js');
const branchRoute = require('./modules/branch/routes.js');

router.use('/api/users',userRoute);
router.use('/api/auth',authRoute);
router.use('/api/branches',branchRoute);

module.exports = router;