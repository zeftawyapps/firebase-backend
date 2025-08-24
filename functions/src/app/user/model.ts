export interface UserModel {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: string;
  isArchived?: boolean;
  updatedAt?: string;
  isActive?: boolean;
  isFirstTimeLogin?: boolean;
}

export class User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: Date;
  isArchived?: boolean = false;
  updatedAt?: Date;
  isActive?: boolean = true;
  isFirstTimeLogin?: boolean = true;

  constructor(data: Partial<UserModel>) {
    this.uid = data.uid || "";
    this.name = data.name || "";
    this.email = data.email || "";
    this.phone = data.phone || "";
    this.role = data.role || "user";
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.isArchived = data.isArchived ?? false;
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.isActive = data.isActive ?? true;
    this.isFirstTimeLogin = data.isFirstTimeLogin ?? true;
  }

  toJson(): UserModel {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      createdAt: this.createdAt?.toISOString(),
      isArchived: this.isArchived,
      updatedAt: this.updatedAt?.toISOString(),
      isActive: this.isActive,
      isFirstTimeLogin: this.isFirstTimeLogin,
    };
  }
}
