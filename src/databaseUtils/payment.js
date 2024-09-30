const pool = require('./databaseCon.js');

const numberOfResultRows = 20;

async function getAllPaymentsAdmin(pageNumber)
{
    const rowsToSkip = (pageNumber-1)*numberOfResultRows;
    const pagination = 'order by PAYMENT.id desc LIMIT '+numberOfResultRows.toString()+' offset ?'; //rowsToSkip

    const dataSelection = "PAYMENT.id,DATE_FORMAT(PAYMENT.date, '%Y-%m-%d') as date,PAYMENT.concept,PAYMENT.amount,PAYMENT.commissionAmount,PAYMENT.method";
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,COALESCE(CONCAT(' ',STUDENT.matLastname), '')) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,COALESCE(CONCAT(' ',USER.matLastname), '')) as teacher";

    const [rows] = await pool.query('select ' + dataSelection  +studentDataSelection+ userDataSelection+' from PAYMENT inner join STUDENT on STUDENT.id = PAYMENT.idStudent inner join TEACHER on TEACHER.id = PAYMENT.idTeacher inner join USER on USER.id = TEACHER.id '+pagination,[rowsToSkip]);
    return rows;
}

async function getAllPayments(id, pageNumber)
{
    const rowsToSkip = (pageNumber-1)*numberOfResultRows;
    const pagination = 'order by PAYMENT.id desc LIMIT '+numberOfResultRows.toString()+' offset ?';

    const dataSelection = "PAYMENT.id,DATE_FORMAT(PAYMENT.date, '%Y-%m-%d')as date,PAYMENT.concept,PAYMENT.amount,PAYMENT.commissionAmount,PAYMENT.method";
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,COALESCE(CONCAT(' ',STUDENT.matLastname), '')) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,COALESCE(CONCAT(' ',USER.matLastname), '')) as teacher";

    const [rows] = await pool.query('select ' + dataSelection  +studentDataSelection+ userDataSelection+' from PAYMENT inner join STUDENT on STUDENT.id = PAYMENT.idStudent inner join TEACHER on TEACHER.id = PAYMENT.idTeacher inner join USER on USER.id = TEACHER.id where PAYMENT.idTeacher = ? '+pagination,[id,rowsToSkip]);
    return rows;
}

async function getNumberOfPagesAdmin()
{
    const [rows] = await pool.query('select COUNT(id) as row_num from PAYMENT');
    let numberOfPages = rows[0].row_num / numberOfResultRows;

    if(numberOfPages !== Math.trunc(numberOfPages))
    {
        numberOfPages = Math.trunc(numberOfPages) +1;
    }

    return numberOfPages;    
}

async function getNumberOfPages(id)
{
    const [rows] = await pool.query('select COUNT(id) as row_num from PAYMENT where PAYMENT.idTeacher = ?',[id]);
    let numberOfPages = rows[0].row_num / numberOfResultRows;

    if(numberOfPages !== Math.trunc(numberOfPages))
    {
        numberOfPages = Math.trunc(numberOfPages) +1;
    }

    return numberOfPages;    
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
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,COALESCE(CONCAT(' ',STUDENT.matLastname), '')) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,COALESCE(CONCAT(' ',USER.matLastname), '')) as teacher";

    const [rows] = await pool.query('select ' + dataSelection  +studentDataSelection+ userDataSelection+' from PAYMENT inner join STUDENT on STUDENT.id = PAYMENT.idStudent inner join TEACHER on TEACHER.id = PAYMENT.idTeacher inner join USER on USER.id = TEACHER.id where PAYMENT.id = ?',[id]);
    return rows[0];
}

async function getPaymentIdTeacher(id)
{
    const dataSelection = "PAYMENT.id,DATE_FORMAT(PAYMENT.date, '%Y-%m-%d')as date,PAYMENT.concept,PAYMENT.amount,PAYMENT.commissionAmount,PAYMENT.method, PAYMENT.idTeacher";
    const studentDataSelection = ", CONCAT(STUDENT.name,' ',STUDENT.patLastName,COALESCE(CONCAT(' ',STUDENT.matLastname), '')) as student";
    const userDataSelection = ", CONCAT(USER.name,' ',USER.patLastName,COALESCE(CONCAT(' ',USER.matLastname), '')) as teacher";

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

module.exports={getAllPaymentsAdmin,getAllPayments,getNumberOfPages,getNumberOfPagesAdmin,getPaymentIdTeacher,checkTeacherPayment,getPayment,editPayment,createPayment, deletePayment};