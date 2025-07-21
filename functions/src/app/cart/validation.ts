import * as Joi from "joi";
export const cartValidation = {
  cart: Joi.object({
    useId: Joi.string().required(),
    productPath: Joi.string().required(),
    productId: Joi.string().required(),
    productName: Joi.string().required(),
    productSpecific: Joi.string().required(),
    productPrice: Joi.number().required(),
    quantity: Joi.number().required(),
  }),
};
