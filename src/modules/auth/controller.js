const validateSignUp = require('./schemas/signup.js');
const validateLogIn = require('./schemas/login.js');
const validateChangePassword = require('./schemas/changePassword.js');
const validateParamId = require('./schemas/paramId.js');
const response = require('../../utils/responses.js');
const bcrypt = require('bcrypt');
const {generateAccessToken,generateRefreshToken, getRefreshMaxAgeMili} = require('../../jsonWebToken/utils.js')
const {getAuthByUsername, editPassword} = require('../../databaseUtils/userUtils/auth.js');
const {createSession, deleteSession} = require('../../databaseUtils/userUtils/session.js');
const { createUser}= require('../../databaseUtils/userUtils/user.js');
const { getTeacher}= require('../../databaseUtils/userUtils/teacher.js');

async function login(req, res)
{
    try {
        const validation = validateLogIn(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;
    
        const auth = await getAuthByUsername(body.username);
        if(!auth)
        {
            response.error(req,res,'Usuario o contraseña incorrectos',400);
            return;
        }

        const resultado = await bcrypt.compare(body.password,auth.password);
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

        await createJWTCookies(res,auth,teacher);
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

async function getCheck(req, res)
{
    try {
        const type = res.locals.type;

        response.success(req,res,{type:type},200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function signup(req,res)
{
    try {
        const validation = validateSignUp(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;
    
        const auth = await getAuthByUsername(body.username);
        if(auth)
        {
            response.error(req,res,'El nombre de usuario ya existe',400);
            return;
        }
    
        const passwordHash = await hashPassword(body.password);
        const user = await createUser(body.name,body.patLastName,body.matLastName,body.phone,body.username,passwordHash,body.type,body.commission);
    
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
        let validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        validation = validateChangePassword(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        const authAdmin = await getAuthByUsername(res.locals.username);

        const resultado = await bcrypt.compare(body.password,authAdmin.password);
        if(!resultado)
        {
            response.error(req,res,'Contraseña del administrador incorrecta',400);
            return;
        }

        const passwordHash = await hashPassword(body.newPassword);
        const newAuth = await editPassword(passwordHash, params.id, res.locals.idSession);

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

async function createJWTCookies(res, auth,teacher)
{
    const AccessObject = {
        id:auth.id,
        username:auth.username,
        type:teacher.type,
        commission:teacher.commission
    };
    const session = await createSession(auth.id);

    const accessToken = generateAccessToken(AccessObject);
    const refreshToken = generateRefreshToken(session);

    // change sameSite for Domain=.example.com in production
    res.cookie('accessToken',accessToken,{httpOnly:true,sameSite:'None',maxAge:getRefreshMaxAgeMili()});
    res.cookie('refreshToken',refreshToken,{httpOnly:true,sameSite:'None',maxAge:getRefreshMaxAgeMili()});
}

module.exports={login, signup, logout, changePassword, getCheck};