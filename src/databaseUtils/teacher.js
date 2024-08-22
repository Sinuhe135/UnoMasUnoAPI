const pool = require('./databaseCon.js');

async function getTeacher(id)
{
    const [rows] = await pool.query('select * from TEACHER where id = ?',[id]);
    return rows[0];
}

module.exports={getTeacher};