const validateStudent = require('./schemas/student.js');
const validateParamId = require('../../utils/schemas/paramId.js');
const validateParamPage = require('../../utils/schemas/paramPage.js');
const response = require('../../utils/responses.js');
const {getAllGeneralStudents,getAllIndieStudents,getNumberOfGeneralPages,getNumberOfIndiePages,checkTeacherStudent,getStudentIdTeacher, editStudent, deleteStudent, createStudent} = require('../../databaseUtils/student.js');
const {getBranch} = require('../../databaseUtils/branch.js');
const checkAccess = require('../../utils//checkAccess.js');

async function getAll(req,res)
{
    try {
        const validation = validateParamPage(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        let students,numberOfPages;
        
        if(res.locals.type === 'admin' || res.locals.type === 'general')
        {
            [numberOfPages,students] = await Promise.all([getNumberOfGeneralPages(),getAllGeneralStudents(params.page)]);
        }
        else if(res.locals.type === 'independiente')
        {
            [numberOfPages,students] = await Promise.all([getNumberOfIndiePages(res.locals.idAuth),getAllIndieStudents(res.locals.idAuth,params.page)]);
        }

        if(numberOfPages === 0)
        {
            response.error(req,res,'Sin registros',404);
            return;
        }
        else if(params.page > numberOfPages)
        {
            response.error(req,res,'Pagina fuera de los limites',404);
            return;
        }

        const resObject = {numberOfPages:numberOfPages,page:params.page,students:students};
        response.success(req,res,resObject,200);
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

        const studentOwnership = checkAccess.student(student,res.locals.idAuth,res.locals.type);
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

        let [student,branch] = await Promise.all([checkTeacherStudent(params.id),getBranch(body.idBranch)]);

        //let student = await checkTeacherStudent(params.id);
        const studentOwnership = checkAccess.student(student,res.locals.idAuth,res.locals.type);
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

        
        let student = await checkTeacherStudent(params.id);
        const studentOwnership = checkAccess.student(student,res.locals.idAuth,res.locals.type);
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