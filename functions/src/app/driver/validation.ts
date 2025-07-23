import * as Joi from "joi";

export const driverValidation = {
  createDriver: Joi.object({
    currentLocation: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string().optional(),
    }).required(),
    rallyPoint: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string().optional(),
    }).optional(),
  }),

  updateLocation: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.string().optional(),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid("available", "busy", "at_rally_point")
      .required(),
  }),

  setRallyPoint: Joi.object({
    rallyPoint: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string().optional(),
    }).required(),
  }),

  updateRating: Joi.object({
    driverId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }),
};
