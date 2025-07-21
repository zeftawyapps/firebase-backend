import * as Joi from "joi";
export const prodValidation = {
  insert: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().allow(""),
    image: Joi.string().required(),
  }),
  updateProduct: Joi.object().keys({
    name: Joi.string().allow(""),
    price: Joi.number().allow(""),
    description: Joi.string().allow(""),
    image: Joi.string().allow(""),
  }),
};
