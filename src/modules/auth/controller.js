const validateSignUp = require('./schemas/signup.js');
const validateLogIn = require('./schemas/login.js');
const validateChangePassword = require('./schemas/changePassword.js');
const validateParamId = require('./schemas/paramId.js');
const response = require('../../utils/responses.js');
const bcrypt = require('bcrypt');
const {generateAccessToken,generateRefreshToken, getRefreshMaxAgeMili} = require('../../jsonWebToken/utils.js')
const {getAuthByUsername, editPassword} = require('../../databaseUtils/auth.js');
const {createSession, deleteSession} = require('../../databaseUtils/session.js');
const { createUser}= require('../../databaseUtils/user.js');
const { getTeacher}= require('../../databaseUtils/teacher.js');

async function login(req, res)
{
    try {
        const {error} = validateLogIn(req.body);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }
    
        const auth = await getAuthByUsername(req.body.username);
        if(!auth)
        {
            response.error(req,res,'Usuario o contraseña incorrectos',400);
            return;
        }

        const resultado = await bcrypt.compare(req.body.password,auth.password);
        if(!resultado)
        {
            response.error(req,res,'Usuario o contraseña incorrectos',400);
            return;
        }

        const teacher = await getTeacher(auth.id);
        if(!teacher)
        {
            nse.error(req,res,'El usuario no es un maestro',400);
            return;
        }

        await createJWTCookies(res,auth,teacher.type);
        response.success(req,res,{id:auth.id,type:teacher.type},200);

    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function logout(req, res)
{
    try {
        const session = await deleteSession(res.locals.idSession);
        res.cookie('accessToken','',{maxAge:1});
        res.cookie('refreshToken','',{maxAge:1});
        response.success(req,res,{id:session.idAuth},200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function signup(req,res)
{
    try {
        const {error} = validateSignUp(req.body);
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }
    
        let auth = await getAuthByUsername(req.body.username);
        if(auth)
        {
            response.error(req,res,'El nombre de usuario ya existe',400);
            return;
        }
    
        const passwordHash = await hashPassword(req.body.password);
        const user = await createUser(req.body.name,req.body.patLastName,req.body.matLastName,req.body.phone,req.body.username,passwordHash,req.body.type,req.body.commision);
    
        response.success(req,res,user,201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function changePassword(req, res)
{
    try {
        let error = validateParamId(req.params).error;
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }

        error = validateChangePassword(req.body).error;
        if(error)
        {
            response.error(req,res,error.details[0].message,400);
            return;
        }

        const authAdmin = await getAuthByUsername(res.locals.username);

        const resultado = await bcrypt.compare(req.body.password,authAdmin.password);
        if(!resultado)
        {
            response.error(req,res,'Contraseña del administrador incorrecta',400);
            return;
        }

        const passwordHash = await hashPassword(req.body.newPassword);
        const newAuth = await editPassword(passwordHash, req.params.id, res.locals.idSession);

        response.success(req,res,newAuth,201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password.toString(),salt);
}

async function createJWTCookies(res, auth,type)
{
    const authObject = {id:auth.id,username:auth.username,type:type};
    const session = await createSession(auth.id);

    const accessToken = generateAccessToken(authObject);
    const refreshToken = generateRefreshToken(session);

    res.cookie('accessToken',accessToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});
    res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});
}

module.exports={login, signup, logout, changePassword};