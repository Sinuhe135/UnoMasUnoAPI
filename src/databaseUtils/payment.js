const pool = require('./databaseCon.js');

async function getAllPaymentsAdmin()
{
    const dataSelection = "PAYMENT.id,DATE_FORMAT(PAYMENT.date, '%Y-%m-%d') as date,PAYMENT.concept,PAYMENT.amount,PAYMENT.commissionAmount,PAYMENT.method";
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,COALESCE(CONCAT(' ',STUDENT.matLastname), '')) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,COALESCE(CONCAT(' ',USER.matLastname), '')) as teacher";

    const [rows] = await pool.query('select ' + dataSelection  +studentDataSelection+ userDataSelection+' from PAYMENT inner join STUDENT on STUDENT.id = PAYMENT.idStudent inner join TEACHER on TEACHER.id = PAYMENT.idTeacher inner join USER on USER.id = TEACHER.id order by PAYMENT.id desc');
    return rows;
}

async function getAllPayments(id)
{
    const dataSelection = "PAYMENT.id,DATE_FORMAT(PAYMENT.date, '%Y-%m-%d')as date,PAYMENT.concept,PAYMENT.amount,PAYMENT.commissionAmount,PAYMENT.method";
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,COALESCE(CONCAT(' ',STUDENT.matLastname), '')) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,COALESCE(CONCAT(' ',USER.matLastname), '')) as teacher";

    const [rows] = await pool.query('select ' + dataSelection  +studentDataSelection+ userDataSelection+' from PAYMENT inner join STUDENT on STUDENT.id = PAYMENT.idStudent inner join TEACHER on TEACHER.id = PAYMENT.idTeacher inner join USER on USER.id = TEACHER.id where PAYMENT.idTeacher = ? order by PAYMENT.id desc',[id]);
    return rows;
}


async function checkTeacherPayment(id)
{
    const dataSelection = 'id,idTeacher';

    const [rows] = await pool.query('select ' + dataSelection  + ' from PAYMENT where id = ?',[id]);
    return rows[0];
}

async function getPayment(id)
{
    const dataSelection = "PAYMENT.id,DATE_FORMAT(PAYMENT.date, '%Y-%m-%d')as date,PAYMENT.concept,PAYMENT.amount,PAYMENT.commissionAmount,PAYMENT.method";
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,' ',STUDENT.matLastname) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,' ',USER.matLastname) as teacher";

    const [rows] = await pool.query('select ' + dataSelection  +studentDataSelection+ userDataSelection+' from PAYMENT inner join STUDENT on STUDENT.id = PAYMENT.idStudent inner join TEACHER on TEACHER.id = PAYMENT.idTeacher inner join USER on USER.id = TEACHER.id where PAYMENT.id = ?',[id]);
    return rows[0];
}

async function getPaymentIdTeacher(id)
{
    const dataSelection = "PAYMENT.id,DATE_FORMAT(PAYMENT.date, '%Y-%m-%d')as date,PAYMENT.concept,PAYMENT.amount,PAYMENT.commissionAmount,PAYMENT.method, PAYMENT.idTeacher";
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,' ',STUDENT.matLastname) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,' ',USER.matLastname) as teacher";

    const [rows] = await pool.query('select ' + dataSelection  +studentDataSelection+ userDataSelection+' from PAYMENT inner join STUDENT on STUDENT.id = PAYMENT.idStudent inner join TEACHER on TEACHER.id = PAYMENT.idTeacher inner join USER on USER.id = TEACHER.id where PAYMENT.id = ?',[id]);
    return rows[0];
}

async function deletePayment(id)
{
    await pool.query('delete from PAYMENT where id = ?',[id]);
    return {id:id};
}

async function editPayment(concept,amount,commissionAmount,method,idStudent,idTeacher,id)
{
    const fields = 'concept=?,amount=?,commissionAmount=?,method=?,idStudent=?,idTeacher=?';

    await pool.query('update PAYMENT set '+fields+' where id = ?',[concept,amount,commissionAmount,method,idStudent,idTeacher,id]);
    return await getPayment(id);
}

async function createPayment(concept,amount,commissionAmount,method,idStudent,idTeacher)
{
    const fields = 'concept,amount,commissionAmount,method,idStudent,idTeacher';
    const what = '?,?,?,?,?,?';

    const [result] = await pool.query('insert into PAYMENT ('+fields+') values ('+what+')',[concept,amount,commissionAmount,method,idStudent,idTeacher]);
    return await getPayment(result.insertId);
}

module.exports={getAllPaymentsAdmin,getAllPayments,getPaymentIdTeacher,checkTeacherPayment,getPayment,editPayment,createPayment, deletePayment};