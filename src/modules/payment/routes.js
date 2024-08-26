const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {requireAdmin,requireAdminIndie,requireTeacher} = require('../../jsonWebToken/middleware.js');

router.get('/all',requireTeacher,async (req,res) =>{
    await controller.getAll(req,res);
});

router.get('/search/:id',requireTeacher,async (req,res)=>{
    await controller.getSearchId(req,res);
});

router.post('/',requireTeacher, async (req,res)=>{
    await controller.postRoot(req,res);
});

// router.put('/:id',requireAdmin, async (req,res)=>{
//     await controller.putId(req,res);
// });

// router.delete('/:id',requireAdmin,async (req,res)=>{
//     await controller.deleteId(req,res);
// });

module.exports = router;