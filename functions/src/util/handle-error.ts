import { Response } from "express";

/**
 *
 * @param { Response } res
 * @param { any  } err
 */
export function handleError(res: Response, err: any) {
  return res
    .status(500)
    .send({ message: `${err.message}`, code: `${err.code}` });
}
