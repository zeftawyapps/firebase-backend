import * as Joi from "joi";

export const OrderValidation = {
  insert: Joi.object({
    shopId: Joi.string().required(),
    senderDetails: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      notes: Joi.string().allow("").optional(),
    }).required(),
    recipientDetails: Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      notes: Joi.string().allow("").optional(),
    }).required(),
    items: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          description: Joi.string().allow("").optional(),
          quantity: Joi.number().integer().positive().required(),
          unitPrice: Joi.number().positive().required(),
          weight: Joi.number().positive().optional(),
        })
      )
      .required(),
  }),
  update: Joi.object({
    shopId: Joi.string().optional(),
    senderDetails: Joi.object({
      name: Joi.string().optional(),
      phone: Joi.string().optional(),
      address: Joi.string().optional(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
      notes: Joi.string().allow("").optional(),
    }).optional(),
    recipientDetails: Joi.object({
      name: Joi.string().optional(),
      phone: Joi.string().optional(),
      address: Joi.string().optional(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
      notes: Joi.string().allow("").optional(),
    }).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().optional(),
          name: Joi.string().optional(),
          description: Joi.string().allow("").optional(),
          quantity: Joi.number().integer().positive().optional(),
          unitPrice: Joi.number().positive().optional(),
          weight: Joi.number().positive().optional(),
        })
      )
      .optional(),
  }),
};
