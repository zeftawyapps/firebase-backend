import * as Joi from "joi";
export const debValidation = {
  sort: Joi.object({
    catId: Joi.string().required(),
    sort: Joi.number().required(),
  }),
  mony: Joi.object({
    catId: Joi.string().required(),
    mony: Joi.number().required(),
  }),
  data: Joi.object({
    name: Joi.string().required(),
  }),
  publish: Joi.object({
    catId: Joi.string().required(),
    isPublish: Joi.bool().required(),
  }),
};
