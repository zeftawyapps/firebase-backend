// نموذج بيانات المتجر

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  location: null;
  phone: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
}

export class ShopModel {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  location: null;
  phone: string;
  email: string;
  createdAt: Date;
  isActive: boolean;

  constructor(data: Shop) {
    this.id = data.id;
    this.ownerId = data.ownerId;
    this.name = data.name;
    this.address = data.address;
    this.location = null;
    this.phone = data.phone;
    this.email = data.email;
    this.createdAt = data.createdAt;
    this.isActive = data.isActive;
  }

  toJson(): any {
    return {
      id: this.id,
      ownerId: this.ownerId,
      name: this.name,
      address: this.address,
      location: null,
      phone: this.phone,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
      isActive: this.isActive,
    };
  }

  static fromJson(json: any): ShopModel {
    return new ShopModel({
      id: json.id,
      ownerId: json.ownerId,
      name: json.name,
      address: json.address,
      location: null,
      phone: json.phone,
      email: json.email,
      createdAt: new Date(json.createdAt),
      isActive: json.isActive,
    });
  }

  static fromFirestore(doc: any): ShopModel {
    const data = doc.data();
    return new ShopModel({
      id: doc.id,
      ownerId: data.ownerId,
      name: data.name,
      address: data.address,
      location: null,
      phone: data.phone,
      email: data.email,
      createdAt: data.createdAt.toDate(),
      isActive: data.isActive,
    });
  }
}
