const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {requireAdmin, requireTeacher, requireNotLoggedIn, requireSession} = require('./../../jsonWebToken/middleware.js');

router.get('/check',requireTeacher, async (req,res)=>{
    await controller.getCheck(req,res);
});

router.post('/login',requireNotLoggedIn, async (req,res)=>{
    await controller.login(req,res);
});

router.delete('/logout',requireTeacher, requireSession, async (req,res)=>{
    await controller.logout(req,res);
});

router.post('/signup',requireAdmin, async (req,res)=>{
    await controller.signup(req,res);
});

router.put('/changePassword/:id',requireAdmin,requireSession, async (req,res)=>{
    await controller.changePassword(req,res);
});

// router.post('/signupDev', async (req,res)=>{
//     await controller.signup(req,res);
// });

module.exports = router;