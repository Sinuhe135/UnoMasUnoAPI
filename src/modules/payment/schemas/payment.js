const Joi = require('joi');

module.exports = (payment) =>
{
    const schema = Joi.object({
        concept: Joi.string().min(3).max(20).trim().required(),
        amount: Joi.number().min(0).max(99999999).precision(2).required(),
        method: Joi.string().min(3).max(20).trim().required(),
        idStudent: Joi.number().integer().min(1).required()
    });

    return schema.validate(payment);
}