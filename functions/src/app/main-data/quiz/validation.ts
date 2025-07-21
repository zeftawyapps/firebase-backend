import * as Joi from "joi";
export const quizValidation = {
    getQuizs: Joi.object({
       depId:Joi.string().required(),
        
      }),
     
}