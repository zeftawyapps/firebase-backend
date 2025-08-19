// نموذج بيانات السائق

export enum DriverStatus {
  AVAILABLE = "available",
  BUSY = "busy",
  AT_RALLY_POINT = "at_rally_point",
}

export interface Driver {
  name: string;
  id: string;
  currentLocation: null; // يمكن أن يكون الموقع الحالي إما كائن موقع أو سلسلة
  status: DriverStatus;
  rallyPoint?: null;
  lastLocationUpdate: Date;
  rating: number;
  phone?: string;
  createdAt: Date;
  email: string;
  isActive: boolean;
}

export class DriverModel {
  name: string;
  id: string;
  currentLocation?: null;
  status: DriverStatus;
  rallyPoint?: null;
  lastLocationUpdate: Date;
  rating: number;
  createdAt: Date;
  phone?: string;
  isActive: boolean;
  email: string;

  constructor(data: Driver) {
    this.id = data.id;
    this.currentLocation = null;
    this.status = data.status;
    (this.rallyPoint = null), (this.name = data.name);
    this.lastLocationUpdate = data.lastLocationUpdate;
    this.rating = data.rating;
    this.createdAt = new Date();
    this.email = data.email || "";
    this.phone = data.phone || "000-000-0000";
    this.isActive = true; // Assuming drivers are active by default
  }

  toJson(): any {
    return {
      name: this.name,
      id: this.id,
      currentLocation: null,
      status: this.status,
      rallyPoint: null,
      lastLocationUpdate: this.lastLocationUpdate.toISOString(),
      rating: this.rating,
      phone: this.phone,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
      isActive: this.isActive,
    };
  }

  static fromJson(json: any): DriverModel {
    return new DriverModel({
      name: json.name,
      id: json.id,
      currentLocation: null,
      status: json.status as DriverStatus,
      rallyPoint: null,
      lastLocationUpdate: new Date(json.lastLocationUpdate),
      rating: parseFloat(json.rating),
      createdAt: new Date(json.createdAt),
      phone: json.phone || "000-000-0000",
      isActive: json.isActive,
      email: json.email || "",
    });
  }

  static fromFirestore(doc: any): DriverModel {
    const data = doc.data();
    return new DriverModel({
      name: data.name,
      id: doc.id,
      currentLocation: null,
      status: data.status as DriverStatus,
      rallyPoint: null,
      lastLocationUpdate: data.lastLocationUpdate.toDate(),
      rating: data.rating,
      createdAt: data.createdAt.toDate(),
      phone: data.phone || "000-000-0000",
      email: data.email || "",
      isActive: data.isActive,
    } as Driver);
  }
}
