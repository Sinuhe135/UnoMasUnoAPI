const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        id: Joi.number().integer().positive(),
        password: Joi.string().min(3).required()
    });

    return schema.validate(auth);
}