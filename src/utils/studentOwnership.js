module.exports = (student,idAuth, userType) =>
{
    if(!student)
    {
        return {error: 'No se encuentra un estudiante con el ID proporcionado',code: 404};
    }
    
    if(userType === 'admin' || userType === 'general')
    {
        if (student.idTeacher) //general students doesnt have idTeacher
        {
            return {error: 'No puedes acceder al estudiante',code: 403};
        }
    }
    else if(userType === 'independiente')
    {
        if (student.idTeacher !== idAuth)
        {
            return {error: 'No puedes acceder al estudiante',code: 403};
        }
    }

    return {error: null,code: null};
}
