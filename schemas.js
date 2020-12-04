const { any, object } = require('joi');
const Joi = require('joi');
const ExpressError = require('./utils/expressError');

const jpegSchema = Joi.object({
    name: Joi.string().required(),
    data: Joi.object().required(),
    size: Joi.number().required(),
    encoding: Joi.string().required(),
    tempFilePath: Joi.string(),
    truncated: Joi.boolean().required(),
    mimetype: 'image/jpeg',
    md5: Joi.string().required(),
    mv: Joi.function().required()
});

module.exports.movieSchema = Joi.object({
    title: Joi.string().required(),
    banner: Joi.object(),
    poster: Joi.isSchema(jpegSchema),
    runtime: Joi.number().required().min(0),
    director: Joi.string().required(),
    starring: Joi.string().required(),
    mpaa: Joi.string().required(),
    synopsis: Joi.string().required()
});