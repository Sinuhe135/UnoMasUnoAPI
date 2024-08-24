const pool = require('./databaseCon.js');

async function getAllBranches()
{
    const dataSelection = 'id,name,country,state,city,postalCode,address';
    const [rows] = await pool.query('select ' + dataSelection + ' from BRANCH where active = 1');
    return rows;
}

async function getBranch(id)
{
    const dataSelection = 'id,name,country,state,city,postalCode,address';
    const [rows] = await pool.query('select ' + dataSelection + ' from BRANCH where active = 1 and id = ?',[id]);
    return rows[0];
}

async function deleteBranch(id)
{
    await pool.query('update BRANCH set active = 0 where id = ?',[id]);
    return {id:id};
}

async function editBranch(name,country,state,city,postalCode,address, id)
{
    await pool.query('update BRANCH set name = ?,country = ?,state = ?,city = ?,postalCode = ?,address = ? where id = ?',[name,country,state,city,postalCode,address, id]);
    return await getBranch(id);
}

async function createBranch(name,country,state,city,postalCode,addresss)
{
    const [result] = await pool.query('insert into BRANCH (name,country,state,city,postalCode,address) values (?,?,?,?,?,?)',[name,country,state,city,postalCode,addresss]);
    return await getBranch(result.insertId);
}

module.exports={getAllBranches,getBranch,editBranch,createBranch, deleteBranch};