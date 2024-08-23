const validateUser = require('./schema.js');
const response = require('../../utils/responses.js');
const {getAllUsers,getUser, editUser, unactivateUser} = require('../../databaseUtils/user.js');
const {deleteAllUserSessions} = require('../../databaseUtils/session.js');
const {deleteAuth} = require('../../databaseUtils/auth.js');

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
        let user = await getUser(req.params.id);
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
        const {error} = validateUser(req.body);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }
        
        const user = await editUser(req.body.name,req.body.patLastName,req.body.matLastName,req.body.phone,req.params.id);
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
        const sessionResult = await deleteAllUserSessions(req.params.id);

        const auth = await deleteAuth(req.params.id);

        const user = await unactivateUser(req.params.id);
        
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function prueba(req,res)
{
    try {
        let user = await transaction();
    
        response.success(req,res,user,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}


module.exports={getAll, getCurrent, getSearchId, putId, deleteId, prueba};