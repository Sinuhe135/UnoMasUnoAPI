const Joi = require('joi');

module.exports = (branch) =>
{
    const schema = Joi.object({
        name: Joi.string().min(3).max(40).required(),
        country: Joi.string().min(3).max(20).required(),
        state: Joi.string().min(3).max(20).required(),
        city: Joi.string().min(3).max(20).required(),
        postalCode: Joi.string().min(3).max(10),
        address: Joi.string().min(3).max(80).required(),
    });

    return schema.validate(branch);
}