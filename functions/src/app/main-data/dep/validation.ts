import * as Joi from "joi";
export const debValidation = {
    sort: Joi.object({
       depId:Joi.string().required(),
       sort: Joi.number().required() 
      }),
      mony: Joi.object({
        depId:Joi.string().required(),
        mony: Joi.number().required() 
       }),
      create: Joi.object({
        depName:Joi.string().required(),
      
       }),
       publish: Joi.object({
        depId:Joi.string().required(),
        isPublish: Joi.bool().required() 
       }),
}