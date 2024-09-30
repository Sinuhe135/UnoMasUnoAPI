const validatePayment = require('./schemas/payment.js');
const validateParamId = require('./schemas/paramId.js');
const validateParamPage = require('./schemas/paramPage.js');
const response = require('../../utils/responses.js');
const {getAllPaymentsAdmin,getAllPayments,getNumberOfPages,getNumberOfPagesAdmin,checkTeacherPayment,getPayment,getPaymentIdTeacher,editPayment,createPayment, deletePayment} = require('../../databaseUtils/payment.js');
const {checkTeacherStudent} = require('../../databaseUtils/student.js');
const checkAccess = require('../../utils/checkAccess.js');

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

        let payments, numberOfPages;
        
        if(res.locals.type === 'admin')
        {
            [numberOfPages,payments] = await Promise.all([getNumberOfPagesAdmin(),getAllPaymentsAdmin(params.page)]);
        }
        else if(res.locals.type === 'independiente' || res.locals.type === 'general')
        {
            [numberOfPages,payments] = await Promise.all([getNumberOfPages(id),getAllPayments(res.locals.idAuth,params.page)]);
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

        const resObject = {numberOfPages:numberOfPages,page:params.page,payments:payments};
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

        let payment;
        if(res.locals.type === 'admin')
        {
            payment = await getPayment(params.id);
        }
        else if(res.locals.type === 'independiente' || res.locals.type === 'general')
        {
            payment = await getPaymentIdTeacher(params.id);
    
            const paymentAccess = checkAccess.payment(payment,res.locals.idAuth,res.locals.type);
            if(paymentAccess.error)
            {
                response.error(req,res,paymentAccess.error,paymentAccess.code);
                return;
            }

            delete payment.idTeacher;
        }
        
        response.success(req,res,payment,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function postRoot(req,res)
{
    try {
        const validation = validatePayment(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        const student = await checkTeacherStudent(body.idStudent);
        const studentAccess = checkAccess.student(student,res.locals.idAuth,res.locals.type);
        if(studentAccess.error)
        {
            response.error(req,res,studentAccess.error,studentAccess.code);
            return;
        }
        
        let commissionAmount;
        if(res.locals.commission)
            commissionAmount = body.amount * res.locals.commission / 100;

        const payment = await createPayment(body.concept,body.amount,commissionAmount,body.method,body.idStudent,res.locals.idAuth);
    
        response.success(req,res,payment,201);
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

        validation = validatePayment(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        let [student,payment] = await Promise.all([checkTeacherStudent(body.idStudent),checkTeacherPayment(params.id)]);

        let access = checkAccess.student(student,res.locals.idAuth,res.locals.type);
        if(access.error)
        {
            response.error(req,res,access.error,access.code);
            return;
        }

        access = checkAccess.payment(payment,res.locals.idAuth,res.locals.type);
        if(access.error)
        {
            response.error(req,res,access.error,access.code);
            return;
        }

        let commissionAmount;
        if(res.locals.commission)
            commissionAmount = body.amount * res.locals.commission / 100;

        payment = await editPayment(body.concept,body.amount,commissionAmount,body.method,body.idStudent,res.locals.idAuth, params.id);
        
        response.success(req,res,payment,200);
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

        
        let payment = await checkTeacherPayment(params.id);
        const access = checkAccess.payment(payment,res.locals.idAuth,res.locals.type);
        if(access.error)
        {
            response.error(req,res,access.error,access.code);
            return;
        }

        const student = await deletePayment(params.id);
        
        response.success(req,res,student,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}


module.exports={getAll, getSearchId,postRoot, putId, deleteId};