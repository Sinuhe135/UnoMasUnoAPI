const pool = require('../databaseCon.js');

async function getAllUsers()
{
    const dataSelection = 'USER.id, USER.name, USER.patLastName, USER.matLastName, USER.phone, AUTH.username, TEACHER.type, TEACHER.commission';
    const [rows] = await pool.query('select ' + dataSelection + ' from USER inner join AUTH on USER.id = AUTH.id inner join TEACHER on USER.id = TEACHER.id where USER.active = 1');
    return rows;
}

async function getUser(id)
{
    const dataSelection = 'USER.id, USER.name, USER.patLastName, USER.matLastName, USER.phone, AUTH.username, TEACHER.type, TEACHER.commission';
    const [rows] = await pool.query('select ' + dataSelection + ' from USER inner join AUTH on USER.id = AUTH.id inner join TEACHER on USER.id = TEACHER.id where USER.active = 1 and USER.id = ?',[id]);
    return rows[0];
}

async function deleteUser(id)
{
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
    
        await pool.query('delete from SESSION where idAuth = ?',[id]);
        await pool.query('update USER set active = 0 where id = ?',[id]);
        await pool.query('delete from AUTH where id = ?',[id]);
    
        await conn.commit();
        conn.release();

        return {id:id};
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }   
}

async function editUser(name,patLastName,matLastName,phone,commission,id)
{
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
    
        await pool.query('update USER set name = ?,patLastName = ?,matLastName = ?,phone = ? where id = ?',[name,patLastName,matLastName,phone,id]);
        await conn.query('update TEACHER set commission = ? where id = ?',[commission,id]);
    
        await conn.commit();
        conn.release();

        return await getUser(id);
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }   
}

async function createUser(name,patLastName,matLastName,phone,username,password,type,commission)
{
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
    
        const [result] = await conn.query('insert into USER (name,patLastName,matLastName,phone) values (?,?,?,?)',[name,patLastName,matLastName,phone]);
        await conn.query(`insert into AUTH (id,username,password) values (${result.insertId},?,?)`,[username,password]);
        await conn.query(`insert into TEACHER (id,type,commission) values (${result.insertId},?,?)`,[type,commission]);
    
        await conn.commit();
        conn.release();

        return await getUser(result.insertId);
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }   
}

module.exports={getAllUsers,getUser,editUser,createUser, deleteUser};