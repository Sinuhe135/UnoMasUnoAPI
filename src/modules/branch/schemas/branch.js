const Joi = require('joi');

module.exports = (branch) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).max(40).trim().required(),
        country: Joi.string().min(3).max(20).trim().required(),
        state: Joi.string().min(3).max(20).trim().required(),
        city: Joi.string().min(3).max(20).trim().required(),
        postalCode: Joi.string().min(3).max(10).trim().required(),
        address: Joi.string().min(3).max(80).trim().required(),
    });

    return schema.validate(branch);
}