const validateStudent = require('./schemas/student.js');
const validateParamId = require('./schemas/paramId.js');
const response = require('../../utils/responses.js');
const {getAllGeneralStudents,getAllIndieStudents,checkTeacher,getStudentIdTeacher, editStudent, deleteStudent, createStudent} = require('../../databaseUtils/student.js');
const {getBranch} = require('../../databaseUtils/branch.js');
const checkStudentOwnership = require('../../utils/studentOwnership.js');

async function getAll(req,res)
{
    try {
        let students;
        
        if(res.locals.type === 'admin' || res.locals.type === 'general')
        {
            students = await getAllGeneralStudents();
        }
        else if(res.locals.type === 'independiente')
        {
            students = await getAllIndieStudents(res.locals.idAuth);
        }

        response.success(req,res,students,200);
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

        let student = await getStudentIdTeacher(params.id);

        const studentOwnership = checkStudentOwnership(student,res.locals.idAuth,res.locals.type);
        if(studentOwnership.error)
        {
            response.error(req,res,studentOwnership.error,studentOwnership.code);
            return;
        }
        
        delete student.idTeacher;
        
        response.success(req,res,student,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function postRoot(req,res)
{
    try {
        const validation = validateStudent(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        const branch = await getBranch(body.idBranch);
        if(!branch)
        {
            response.error(req,res,'No se encuentra una sucursal con el ID proporcionado',404);
            return;
        }
        
        let insertIdTeacher;
        if(res.locals.type === 'admin' || res.locals.type === 'general')
        {
            insertIdTeacher = null;
        }
        else if(res.locals.type === 'independiente')
        {
            insertIdTeacher = res.locals.idAuth;
        }

        const student = await createStudent(body.name,body.patLastName,body.matLastName,body.momFullName,
            body.dadFullName,body.country,body.state,body.city,body.postalCode,body.address,body.emergencyPhone,body.visitReason,body.prevDiag,body.alergies,body.comments,insertIdTeacher,body.idBranch);
    
        response.success(req,res,student,201);
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

        validation = validateStudent(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        let [student,branch] = await Promise.all([checkTeacher(params.id),getBranch(body.idBranch)]);

        //let student = await checkTeacher(params.id);
        const studentOwnership = checkStudentOwnership(student,res.locals.idAuth,res.locals.type);
        if(studentOwnership.error)
        {
            response.error(req,res,studentOwnership.error,studentOwnership.code);
            return;
        }

        //const branch = await getBranch(body.idBranch);
        if(!branch)
        {
            response.error(req,res,'No se encuentra una sucursal con el ID proporcionado',404);
            return;
        }

        student = await editStudent(body.name,body.patLastName,body.matLastName,body.momFullName,
            body.dadFullName,body.country,body.state,body.city,body.postalCode,body.address,body.emergencyPhone,body.visitReason,body.prevDiag,body.alergies,body.comments,body.idBranch, params.id);
        
        response.success(req,res,student,200);
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

        
        let student = await checkTeacher(params.id);
        const studentOwnership = checkStudentOwnership(student,res.locals.idAuth,res.locals.type);
        if(studentOwnership.error)
        {
            response.error(req,res,studentOwnership.error,studentOwnership.code);
            return;
        }

        student = await deleteStudent(params.id);
        
        response.success(req,res,student,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}


module.exports={getAll, getSearchId,postRoot, putId, deleteId};