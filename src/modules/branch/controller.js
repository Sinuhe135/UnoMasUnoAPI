const validateBranch = require('./schemas/branch.js');
const validateParamId = require('./schemas/paramId.js');
const response = require('../../utils/responses.js');
const {getAllBranches,getBranch, editBranch, deleteBranch, createBranch} = require('../../databaseUtils/branch.js');

async function getAll(req,res)
{
    try {
        const branches = await getAllBranches();
        response.success(req,res,branches,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function getSearchId(req,res)
{
    try {
        const {error} = validateParamId(req.params);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }

        const branch = await getBranch(req.params.id);
        if(!branch)
        {
            response.error(req,res,'No se encuentra una sucursal con el ID proporcionado',404);
            return;
        }
    
        response.success(req,res,branch,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function postRoot(req,res)
{
    try {
        const {error} = validateBranch(req.body);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }
    
        const branch = await createBranch(req.body.name,req.body.country,req.body.state,req.body.city,req.body.postalCode,req.body.address);
    
        response.success(req,res,branch,201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function putId(req,res)
{
    try 
    {
        let error = validateParamId(req.params).error;
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }

        error = validateBranch(req.body).error;
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }

        let branch = await getBranch(req.params.id);
        if(!branch)
        {
            response.error(req,res,'No se encuentra una sucursal con el ID proporcionado',404);
            return;
        }
        
        branch = await editBranch(req.body.name,req.body.country,req.body.state,req.body.city,req.body.postalCode,req.body.address, req.params.id);
        response.success(req,res,branch,200);
    } 
    catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function deleteId(req,res)
{
    try {
        const {error} = validateParamId(req.params);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }

        let branch = await getBranch(req.params.id);
        if(!branch)
        {
            response.error(req,res,'No se encuentra una sucursal con el ID proporcionado',404);
            return;
        }

        branch = await deleteBranch(req.params.id);
        
        response.success(req,res,branch,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}


module.exports={getAll, getSearchId,postRoot, putId, deleteId};