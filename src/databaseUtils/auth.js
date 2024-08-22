const pool = require('./databaseCon.js');

async function getAuth(id)
{
    const [rows] = await pool.query('select id,username from AUTH where id = ?',[id]);
    return rows[0];
}

async function getAuthByUsername(username)
{
    const [rows] = await pool.query('select * from AUTH where username = ?',[username]);
    return rows[0]; 
}

async function deleteAuth(id)
{
    const deletedAuth = await getAuth(id);
    const [result] = await pool.query('delete from AUTH where id = ?',[id]);
    return deletedAuth;
}

async function editPassword(password,id)
{
    const [result] = await pool.query('update AUTH set password = ? where id = ?',[password,id]);
    return await getAuth(id);
}

module.exports={getAuthByUsername, deleteAuth, getAuth, editPassword};