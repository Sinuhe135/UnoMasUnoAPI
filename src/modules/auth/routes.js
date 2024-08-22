const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {getAuthInfo, getSessionInfo, requireNotLoggedIn} = require('./../../jsonWebToken/middleware.js');

router.post('/login',requireNotLoggedIn, async (req,res)=>{
    await controller.login(req,res);
});

router.post('/logout', async (req,res)=>{
    await controller.logout(req,res);
});

router.post('/signup', async (req,res)=>{
    await controller.signup(req,res);
});

router.put('/changePassword', async (req,res)=>{
    await controller.changePassword(req,res);
});




module.exports = router;