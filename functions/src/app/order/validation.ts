import * as Joi from "joi";
export const OrderValidation = {
  insert: Joi.object({
    client: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      clientId: Joi.string().required(),
    }).required(),
    orderDate: Joi.date().iso(),
    products: Joi.array()
      .items(
        Joi.object({
          id: Joi.required(),
          productData: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(""),
            price: Joi.number().required(),
            image: Joi.string().optional(),
            id: Joi.string().optional(),
          }),
          name: Joi.string().required(),
          total: Joi.number().positive().required(),
          quantity: Joi.number().integer().positive().required(),
          price: Joi.number().positive().required(),
        })
      )
      .required(),
    total: Joi.number().positive().required(),
    status: Joi.number().integer().required(),
    taxRate: Joi.number().positive().required(),
    tax: Joi.number().positive().required(),
    netTotal: Joi.number().positive().required(),
  }),
  update: Joi.object({
    orderDate: Joi.date().iso(),
    products: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().optional(),
          productData: Joi.object({
            name: Joi.string().optional(),
            description: Joi.string().allow(""),
            price: Joi.number().optional(),
            image: Joi.string().optional(),
            id: Joi.string().optional(),
          }),
          name: Joi.string().optional(),
          quantity: Joi.number().integer().positive().optional(),
          price: Joi.number().positive().optional(),
        })
      )
      .optional(),
    total: Joi.number().positive().optional(),
    status: Joi.number().integer().optional(),
    taxRate: Joi.number().positive().optional(),
    tax: Joi.number().positive().optional(),
    netTotal: Joi.number().positive().optional(),
  }),
};
