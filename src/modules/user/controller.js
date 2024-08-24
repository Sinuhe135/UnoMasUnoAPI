const validateUser = require('./schemas/user.js');
const validateParamId = require('./schemas/paramId.js');
const response = require('../../utils/responses.js');
const {getAllUsers,getUser, editUser, deleteUser} = require('../../databaseUtils/user.js');

async function getAll(req,res)
{
    try {
        const users = await getAllUsers();
        response.success(req,res,users,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function getCurrent(req,res)
{
    try {
        const user = await getUser(res.locals.idAuth);
    
        response.success(req,res,user,200);
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

        const user = await getUser(req.params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }
    
        response.success(req,res,user,200);
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

        error = validateUser(req.body).error;
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }

        let user = await getUser(req.params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }
        
        user = await editUser(req.body.name,req.body.patLastName,req.body.matLastName,req.body.phone,req.body.commision,req.params.id);
        response.success(req,res,user,200);
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

        let user = await getUser(req.params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }

        user = await deleteUser(req.params.id);
        
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}


module.exports={getAll, getCurrent, getSearchId, putId, deleteId};