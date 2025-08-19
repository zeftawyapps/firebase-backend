// نموذج بيانات المستخدم

export enum UserRole {
  ADMIN = "admin",
  DRIVER = "driver",
  SHOP_OWNER = "shop_owner",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  isActive: boolean;
}

export class UserModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  isActive: boolean;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.passwordHash = data.passwordHash;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.isActive = data.isActive;
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      passwordHash: this.passwordHash,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      isActive: this.isActive,
    };
  }

  static fromJson(json: any): UserModel {
    return new UserModel({
      id: json.id,
      name: json.name,
      email: json.email,
      phone: json.phone,
      passwordHash: json.passwordHash,
      role: json.role as UserRole,
      createdAt: new Date(json.createdAt),
      isActive: json.isActive,
    });
  }

  static fromFirestore(doc: any): UserModel {
    const data = doc.data();
    return new UserModel({
      id: doc.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: data.passwordHash,
      role: data.role as UserRole,
      createdAt: data.createdAt.toDate(),
      isActive: data.isActive,
    });
  }
}
