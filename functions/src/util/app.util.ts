import { v4 as uuidv4 } from "uuid";
import { ValidationException } from "../exception/validation.exception";

export class AppUtil {
  static generateID() {
    return uuidv4();
  }

  static validate(data: any, schema: any) {
    const result = schema.validate(data);
    if (result.error) {
      const errorMessages = (result.error.details as any[]).map(
        (e) => e.message
      );
      throw new ValidationException(errorMessages.join("\n"), result.error);
    }
    return result.value;
  }

  static generateRandomInt(length = 6) {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static generateRandomString(length = 8) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static generateInvitationCode() {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code = code + Math.floor(Math.random() * 9);
    }
    return code;
  }
}
