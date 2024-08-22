const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const {getAuthInfo} = require('../../jsonWebToken/middleware.js');

router.get('/all',async (req,res) =>{
    await controller.getAll(req,res);
});

router.get('/current',async (req,res)=>{
    await controller.getCurrent(req,res);
});

router.get('/search/:id',async (req,res)=>{
    await controller.getSearchId(req,res);
});

router.put('/:id', async (req,res)=>{
    await controller.putId(req,res);
});

router.delete('/:id',async (req,res)=>{
    await controller.deleteId(req,res);
});

router.get('/prueba',async (req,res)=>{
    await controller.prueba(req,res);
});

module.exports = router;