const Joi = require('joi');

module.exports = (student) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).trim().required(),
        patLastName: Joi.string().min(3).max(30).trim().required(),
        matLastName: Joi.string().min(3).max(30).trim(),
        momFullName: Joi.string().min(3).max(50).trim(),
        dadFullName: Joi.string().min(3).max(50).trim(),
        country: Joi.string().min(3).max(20).trim().required(),
        state: Joi.string().min(3).max(20).trim().required(),
        city: Joi.string().min(3).max(20).trim().required(),
        postalCode: Joi.string().min(3).max(10).trim().required(),
        address: Joi.string().min(3).max(80).trim().required(),
        emergencyPhone: Joi.string().min(3).max(15).trim().required(),
        visitReason: Joi.string().min(3).max(255),
        prevDiag: Joi.string().min(3).max(255).trim(),
        alergies: Joi.string().min(3).max(255).trim(),
        comments: Joi.string().min(3).max(255).trim(),
        idBranch: Joi.number().integer().min(1).required()
    });

    return schema.validate(student);
}