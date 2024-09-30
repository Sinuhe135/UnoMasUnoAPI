const pool = require('./databaseCon.js');

const numberOfResultRows = 20;

async function getAllGeneralStudents(pageNumber)
{
    const rowsToSkip = (pageNumber-1)*numberOfResultRows;
    const pagination = 'order by STUDENT.id desc LIMIT '+numberOfResultRows.toString()+' offset ?'; //rowsToSkip

    const dataSelection = 'STUDENT.id,STUDENT.name,STUDENT.patLastName,STUDENT.matLastName,STUDENT.momFullName,STUDENT.dadFullName,STUDENT.country,STUDENT.state';
    const dataSelection2 = ',STUDENT.city,STUDENT.postalCode,STUDENT.address,STUDENT.emergencyPhone,STUDENT.visitReason,STUDENT.prevDiag,STUDENT.alergies,STUDENT.comments, BRANCH.name as branchName';

    const [rows] = await pool.query('select ' + dataSelection + dataSelection2 + ' from STUDENT  inner join BRANCH on STUDENT.idBranch = BRANCH.id where STUDENT.active = 1 and STUDENT.idTeacher is null '+pagination,[rowsToSkip]);
    return rows;
}

async function getAllIndieStudents(idTeacher, pageNumber)
{
    const rowsToSkip = (pageNumber-1)*numberOfResultRows;
    const pagination = 'order by STUDENT.id desc LIMIT '+numberOfResultRows.toString()+' offset ?'; //rowsToSkip

    const dataSelection = 'STUDENT.id,STUDENT.name,STUDENT.patLastName,STUDENT.matLastName,STUDENT.momFullName,STUDENT.dadFullName,STUDENT.country,STUDENT.state';
    const dataSelection2 = ',STUDENT.city,STUDENT.postalCode,STUDENT.address,STUDENT.emergencyPhone,STUDENT.visitReason,STUDENT.prevDiag,STUDENT.alergies,STUDENT.comments, BRANCH.name as branchName';

    const [rows] = await pool.query('select ' + dataSelection + dataSelection2 + ' from STUDENT  inner join BRANCH on STUDENT.idBranch = BRANCH.id where STUDENT.active = 1 and STUDENT.idTeacher = ? '+pagination,[idTeacher, rowsToSkip]);
    return rows;
}

async function getNumberOfGeneralPages()
{
    const [rows] = await pool.query('select COUNT(id) as row_num from STUDENT where active = 1 and idTeacher is null');
    let numberOfPages = rows[0].row_num / numberOfResultRows;

    if(numberOfPages !== Math.trunc(numberOfPages))
    {
        numberOfPages = Math.trunc(numberOfPages) +1;
    }

    return numberOfPages;    
}

async function getNumberOfIndiePages(idTeacher)
{
    const [rows] = await pool.query('select COUNT(id) as row_num from STUDENT where active = 1 and idTeacher = ?',[idTeacher]);
    let numberOfPages = rows[0].row_num / numberOfResultRows;

    if(numberOfPages !== Math.trunc(numberOfPages))
    {
        numberOfPages = Math.trunc(numberOfPages) +1;
    }

    return numberOfPages;    
}

async function checkTeacherStudent(id)
{
    const dataSelection = 'id,idTeacher';

    const [rows] = await pool.query('select ' + dataSelection  + ' from STUDENT where active = 1 and id = ?',[id]);
    return rows[0];
}

async function getStudent(id)
{
    const dataSelection = 'STUDENT.id,STUDENT.name,STUDENT.patLastName,STUDENT.matLastName,STUDENT.momFullName,STUDENT.dadFullName,STUDENT.country,STUDENT.state';
    const dataSelection2 = ',STUDENT.city,STUDENT.postalCode,STUDENT.address,STUDENT.emergencyPhone,STUDENT.visitReason,STUDENT.prevDiag,STUDENT.alergies,STUDENT.comments, BRANCH.name as branchName';

    const [rows] = await pool.query('select ' + dataSelection + dataSelection2 + ' from STUDENT  inner join BRANCH on STUDENT.idBranch = BRANCH.id and STUDENT.id = ? where STUDENT.active = 1',[id]);
    return rows[0];
}

async function getStudentIdTeacher(id)
{
    const dataSelection = 'STUDENT.id,STUDENT.name,STUDENT.patLastName,STUDENT.matLastName,STUDENT.momFullName,STUDENT.dadFullName,STUDENT.country,STUDENT.state,STUDENT.city,STUDENT.postalCode';
    const dataSelection2 = ',STUDENT.address,STUDENT.emergencyPhone,STUDENT.visitReason,STUDENT.prevDiag,STUDENT.alergies,STUDENT.comments, STUDENT.idTeacher, BRANCH.name as branchName';

    const [rows] = await pool.query('select ' + dataSelection + dataSelection2 + ' from STUDENT  inner join BRANCH on STUDENT.idBranch = BRANCH.id and STUDENT.id = ? where STUDENT.active = 1',[id]);
    return rows[0];
}

async function deleteStudent(id)
{
    await pool.query('update STUDENT set active = 0 where id = ?',[id]);
    return {id:id};
}

async function editStudent(name,patLastName,matLastName,momFullName,dadFullName,country,state,city,postalCode,address,emergencyPhone,visitReason,prevDiag,alergies,comments,idBranch, id)
{
    const fields = 'name = ?,patLastName = ?,matLastName = ?,momFullName = ?,dadFullName = ?,country = ?,state = ?,city = ?,postalCode = ?,address = ?,emergencyPhone = ?,visitReason = ?,prevDiag = ?,alergies = ?,comments = ?,idBranch = ?';

    await pool.query('update STUDENT set '+fields+' where id = ?',[name,patLastName,matLastName,momFullName,dadFullName,country,state,city,postalCode,address,emergencyPhone,visitReason,
        prevDiag,alergies,comments,idBranch, id]);
    return await getStudent(id);
}

async function createStudent(name,patLastName,matLastName,momFullName,dadFullName,country,state,city,postalCode,address,emergencyPhone,visitReason,prevDiag,alergies,comments,idTeacher,idBranch)
{
    const fields = 'name,patLastName,matLastName,momFullName,dadFullName,country,state,city,postalCode,address,emergencyPhone,visitReason,prevDiag,alergies,comments,idTeacher,idBranch';
    const what = '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?';

    const [result] = await pool.query('insert into STUDENT ('+fields+') values ('+what+')',[name,patLastName,matLastName,momFullName,dadFullName,country,state,city,postalCode,
        address,emergencyPhone,visitReason,prevDiag,alergies,comments,idTeacher,idBranch]);
    return await getStudent(result.insertId);
}

module.exports={getAllGeneralStudents,getAllIndieStudents,getNumberOfGeneralPages,getNumberOfIndiePages,checkTeacherStudent,getStudent,getStudentIdTeacher,editStudent,createStudent, deleteStudent};