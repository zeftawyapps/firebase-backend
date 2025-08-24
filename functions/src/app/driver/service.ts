import { DriverRepo } from "./repo";
import { DriverModel, DriverStatus } from "../../data_moleds";

export class DriverService {
  driverRepo: DriverRepo;

  constructor() {
    this.driverRepo = new DriverRepo();
  }

  // Create driver profile
  async createDriver(uid: string, driverData: DriverModel): Promise<string> {
    return await this.driverRepo.createDriver(uid, driverData);
  }
  async updateDriverOnLogIn(uid: string, driverData: any) {
    await this.driverRepo.updateDriverLogIn(uid, driverData);
  }
  // Update driver location
  async updateLocation(uid: string, location: any) {
    await this.driverRepo.updateLocation(uid, location);
  }

  // Update driver status
  async updateStatus(uid: string, status: DriverStatus) {
    await this.driverRepo.updateStatus(uid, status);
  }

  // Get driver profile
  async getDriverProfile(uid: string) {
    return await this.driverRepo.getDriverProfile(uid);
  }

  async getDriverById(uid: string) {
    return await this.driverRepo.getDriverById(uid);
  }

  // Get nearby drivers
  // async getNearbyDrivers(location: any, radiusKm = 5) {
  //   return await this.driverRepo.getNearbyDrivers(location, radiusKm);
  // }

  // Set rally point
  async setRallyPoint(uid: string, rallyPoint: any) {
    await this.driverRepo.setRallyPoint(uid, rallyPoint);
  }

  // Update driver rating
  async updateRating(driverId: string, rating: number) {
    // Here you could implement rating calculation logic
    // For example, average of all ratings
    await this.driverRepo.updateRating(driverId, rating);
  }

  // Additional business logic methods

  // Check if driver is available for new orders
  async isDriverAvailable(uid: string): Promise<boolean> {
    try {
      const driver = await this.driverRepo.getDriverProfile(uid);
      return driver.status === DriverStatus.AVAILABLE;
    } catch (error) {
      return false;
    }
  }

  // Get driver statistics
  async getDriverStats(uid: string) {
    const driver = await this.driverRepo.getDriverProfile(uid);
    return {
      rating: driver.rating,
      status: driver.status,
      lastLocationUpdate: driver.lastLocationUpdate,
      hasRallyPoint: !!driver.rallyPoint,
    };
  }
}
