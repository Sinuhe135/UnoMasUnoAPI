const Joi = require('joi');

module.exports = (user) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        patLastName: Joi.string().min(3).max(30).required(),
        matLastName: Joi.string().min(3).max(30),
        phone: Joi.string().min(3).max(15).required(),
    });

    return schema.validate(user);
}