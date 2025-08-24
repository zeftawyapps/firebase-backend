import * as Joi from "joi";
export const gameResultValidation = {
  gameResult: Joi.object({
    depId: Joi.string().required(),
    currectAnsers: Joi.number().required(),
    score: Joi.number().required(),
    // depLevel: Joi.number().required(),
  }),
  addMony: Joi.object({
    mony: Joi.number().required(),
  }),
};

export const userValidation = {
  logIn: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createAccount: Joi.object({
    uid: Joi.string().optional(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
    createdAt: Joi.string().optional(),
    isArchived: Joi.boolean().optional(),
    updatedAt: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    isFirstTimeLogin: Joi.boolean().optional(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  createProfile: Joi.object({
    uid: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
    createdAt: Joi.string().optional(),
    isArchived: Joi.boolean().optional(),
    updatedAt: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    isFirstTimeLogin: Joi.boolean().optional(),
  }),
};
