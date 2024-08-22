const Joi = require('joi');

module.exports = (auth) =>
{
    const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        password: Joi.string().min(3).required(),
        name: Joi.string().min(3).max(30).required(),
        patLastName: Joi.string().min(3).max(30).required(),
        matLastName: Joi.string().min(3).max(30),
        phone: Joi.string().min(3).max(15).required(),
        type: Joi.string().valid('admin','general','indie').required(),
        commision: Joi.number().min(0).max(99.99).precision(2)
    });

    return schema.validate(auth);
}