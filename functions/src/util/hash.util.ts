const bcrypt = require("bcrypt");

export class HashUtil {
  static async hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  static async verify(hashedPassword: string, plainPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
