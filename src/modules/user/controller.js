const validateUser = require('./schemas/user.js');
const validateParamId = require('./schemas/paramId.js');
const response = require('../../utils/responses.js');
const {getAllUsers,getUser, editUser, deleteUser} = require('../../databaseUtils/userUtils/user.js');

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
        const validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        const user = await getUser(params.id);
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
        let validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        validation = validateUser(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        let user = await getUser(params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }
        
        user = await editUser(body.name,body.patLastName,body.matLastName,body.phone,body.commission,params.id);
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
        let validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        let user = await getUser(params.id);
        if(!user)
        {
            response.error(req,res,'No se encuentra un usuario con el ID proporcionado',404);
            return;
        }

        user = await deleteUser(params.id);

        if(params.id === res.locals.idAuth)
        {
            res.cookie('accessToken','',{maxAge:1});
            res.cookie('refreshToken','',{maxAge:1});

            user.selfDeleted = true;
        }
        else
        {
            user.selfDeleted = false;
        }
        
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}


module.exports={getAll, getCurrent, getSearchId, putId, deleteId};