// نموذج بيانات الموقع

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export class LocationModel {
  latitude: number;
  longitude: number;
  address?: string;

  constructor(data: Location) {
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.address = data.address;
  }

  toJson(): any {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address,
    };
  }

  static fromJson(json: any): LocationModel {
    return new LocationModel({
      latitude: json.latitude,
      longitude: json.longitude,
      address: json.address,
    });
  }

  // Calculate distance between two locations (in kilometers)
  distanceTo(other: LocationModel): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(other.latitude - this.latitude);
    const dLon = this.toRadians(other.longitude - this.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.latitude)) *
        Math.cos(this.toRadians(other.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  toString(): string {
    return `Location(${this.latitude}, ${this.longitude})`;
  }
}
