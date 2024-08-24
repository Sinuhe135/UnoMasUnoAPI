const Joi = require('joi');

module.exports = (user) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        patLastName: Joi.string().min(3).max(30).required(),
        matLastName: Joi.string().min(3).max(30),
        phone: Joi.string().min(3).max(15).required(),
        commision: Joi.number().min(0).max(99.99).precision(2)
    });

    return schema.validate(user);
}