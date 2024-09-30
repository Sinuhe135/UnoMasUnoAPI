const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {requireAdminIndie,requireTeacher} = require('../../jsonWebToken/middleware.js');

router.get('/all/:page',requireTeacher,async (req,res) =>{
    await controller.getAll(req,res);
});

router.get('/search/:id',requireTeacher,async (req,res)=>{
    await controller.getSearchId(req,res);
});

router.post('/',requireAdminIndie, async (req,res)=>{
    await controller.postRoot(req,res);
});

router.put('/:id',requireAdminIndie, async (req,res)=>{
    await controller.putId(req,res);
});

router.delete('/:id',requireAdminIndie,async (req,res)=>{
    await controller.deleteId(req,res);
});

module.exports = router;