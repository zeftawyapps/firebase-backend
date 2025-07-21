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
