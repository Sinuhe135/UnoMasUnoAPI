const jwt = require('jsonwebtoken');
const {getKey, getRefreshMaxAgeMili,generateAccessToken,generateRefreshToken} = require('./utils.js');
const response = require('./../utils/responses.js');
const {getSession, updateStartDate} = require('./../databaseUtils/userUtils/session.js');
const {getAuth} = require('./../databaseUtils/userUtils/auth.js');
const {getTeacher} = require('./../databaseUtils/userUtils/teacher.js');

// Exports //

const requireAdmin = async (req,res,next) =>{
    try {
        const lookingTypes = ['admin'];

        const logInSuccess = await checkAccessToken(req,res,lookingTypes);
        if(logInSuccess)
            return next();

    } catch (error) {
        console.log(`Hubo un error con requireAdmin en ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};

const requireAdminIndie = async (req,res,next) =>{
    try {
        const lookingTypes = ['admin','independiente'];

        const logInSuccess = await checkAccessToken(req,res,lookingTypes);
        if(logInSuccess)
            return next();

    } catch (error) {
        console.log(`Hubo un error con requireAdminIndie en ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};

const requireTeacher = async (req,res,next) =>{
    try {
        const lookingTypes = ['admin','general','independiente'];

        const logInSuccess = await checkAccessToken(req,res,lookingTypes);
        if(logInSuccess)
            return next();

    } catch (error) {
        console.log(`Hubo un error con requireTeacher en ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};

const requireSession = async (req,res,next) =>{
    try {
        const checkingSuccess = await checkRefreshTokenInfo(req,res)
        if(checkingSuccess)
            return next();

    } catch (error) {
        console.log(`Hubo un error en getSessionInfo con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};

const requireNotLoggedIn = async (req,res,next) =>{
    try {
        const logInSuccess = await checkNotAccessToken(req,res);
        if(!logInSuccess)
        {
            return next();
        }

    } catch (error) {
        console.log(`Hubo un error con requireNotLoggedIn en ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
};

// Functionality //

async function checkAccessToken(req,res, lookingTypes)
{
    const accessToken = req.cookies.accessToken;
    
    if(!accessToken)
    {
        response.error(req,res,"Sesion no iniciada",401);
        return false;
    }
    
    let {payload, expired} = verifyJWT(accessToken);
    
    //valid token, but expired
    if(expired)
    {
        payload = await checkRefreshToken(req,res);
        if(!payload)
        {
            response.error(req,res,"Sesion expirada",401);
            return false;
        }
    }
    else if(!payload) //invalid token
    {
        response.error(req,res,"Sesion invalida",401);
        return false;
    }
    
    if(!lookingTypes.includes(payload.type))
    {
        response.error(req,res,"No tienes los permisos necesarios",403);
        return false;
    }
    
    res.locals.idAuth = payload.id;
    res.locals.username = payload.username;
    res.locals.type = payload.type;
    res.locals.commission = payload.commission;

    return true;
}
    
async function checkRefreshToken(req,res)
{
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)
        return null;

    const {payload, expired} = verifyJWT(refreshToken);

    if(expired)
        return null;
    
    if(!payload)
        return null;
    
    const session = await getSession(payload.id);
    
    if(!session)
        return null;

    if(session.idAuth !== payload.idAuth)
        return null;

    const newPayload = await updateAccessToken(res, session);
    return newPayload;
}
                

async function updateAccessToken(res, session)
{
    const [auth,teacher] = await Promise.all([getAuth(session.idAuth),getTeacher(session.idAuth)]);
    
    if (!auth || !teacher)
        return null;
    
    const AccessObject = {
        id:auth.id,
        username:auth.username,
        type:teacher.type,
        commission:teacher.commission
    };
    
    const accessToken = generateAccessToken(AccessObject);
    res.cookie('accessToken',accessToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});
    
    await updateRefreshToken(res, session);
    
    return AccessObject;
}

async function updateRefreshToken(res,session)
{
    //Checks if refreshToken is half the way to expiring 
    if ( getRefreshMaxAgeMili()/2 < Date.now()-session.startDate*1000 )
    {
        const updatedSession = await updateStartDate(session.id);
        const refreshToken = generateRefreshToken(updatedSession);

        res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge:getRefreshMaxAgeMili()});
    }
}

async function checkNotAccessToken(req,res)
{
    const accessToken = req.cookies.accessToken;
    
    if(!accessToken)
    {
        return false;
    }
    
    let {payload, expired} = verifyJWT(accessToken);
    
    //valid token, but expired
    if(expired)
    {
        payload = await checkRefreshToken(req,res, true);
    }
    
    //invalid token
    if(!payload) 
    {
        return false;
    }

    response.error(req,res,"Sesion ya iniciada",409);
    return true;
}

async function checkRefreshTokenInfo(req,res)
{
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)
    {
        response.error(req,res,"Sesion no iniciada",401);
        return false;
    }

    const {payload, expired} = verifyJWT(refreshToken);

    if(expired) //token expired
    {
        response.error(req,res,"Sesion expirada",401);
        return false;
    }
    
    if(!payload)//token invalid
    {
        response.error(req,res,"Sesion invalida",401);
        return false;
    }
    
    const session = await getSession(payload.id);
    
    if(!session)
    {
        response.error(req,res,"Sesion expirada",401);
        return false;
    }

    if(session.idAuth !== payload.idAuth)
    {
        response.error(req,res,"Sesion expirada",401);
        return false;
    }

    res.locals.idSession = session.id;
    return true;
}
    
    
function verifyJWT(token)
{
    try {
        const decoded = jwt.verify(token,getKey());
        return {payload: decoded,expired: false};
        
    } catch (error) {
        if(error.name === 'TokenExpiredError')
        {
            return {payload:null,expired:true}
        }
        else
        {
            return {payload:null,expired:false}
        }
    }
}

module.exports = {requireAdmin,requireAdminIndie, requireTeacher, requireNotLoggedIn, requireSession};