import * as Joi from "joi";

export const shopValidation = {
  createShop: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(10).max(200).required(),
    location: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string().optional(),
    }).required(),
    phone: Joi.string().min(10),
    email: Joi.string().email().required(),
  }),

  updateShop: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string()
      .pattern(/^[+]?[0-9]{10,15}$/)
      .optional(),
    email: Joi.string().email().optional(),
  }),

  updateLocation: Joi.object({
    location: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string().optional(),
    }).required(),
    address: Joi.string().min(10).max(200).required(),
  }),

  toggleStatus: Joi.object({
    isActive: Joi.boolean().required(),
  }),

  searchShops: Joi.object({
    searchTerm: Joi.string().min(2).required(),
    location: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }).optional(),
    radius: Joi.number().min(1).max(50).optional(),
  }),
};
