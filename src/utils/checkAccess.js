function student(student,idAuth, userType)
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
        if(!student.idTeacher)
        {
            throw('student object doesnt have idTeacher when user type is independiente');
        }
    }

    return {error: null,code: null};
}

function payment(payment,idAuth, userType)
{
    if(!payment)
    {
        return {error: 'No se encuentra un pago con el ID proporcionado',code: 404};
    }

    if(!payment.idTeacher)
    {
        throw('payment object doesnt have idTeacher');
    }
    
    if(userType === 'independiente' || userType === 'general')
    {
        if (payment.idTeacher !== idAuth)
        {
            return {error: 'No puedes acceder al pago',code: 403};
        }
    }

    return {error: null,code: null};
}

module.exports = {student,payment}
