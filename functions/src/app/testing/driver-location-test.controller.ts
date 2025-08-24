import { NextFunction, Response } from "express";
import { ResponseUtil } from "../../util/response.util";
import { DriverService } from "../driver/service";
import { LocationPointService } from "../location-point/service";
import { DriverStatus, DriverModel } from "../../data_moleds";

/**
 * Testing API Controller for creating drivers with location points
 * This is specifically for testing purposes to create 20 drivers in Tanta, Egypt
 */
export class DriverLocationTestController {
  private driverService: DriverService;
  private locationPointService: LocationPointService;

  constructor() {
    this.driverService = new DriverService();
    this.locationPointService = new LocationPointService();
  }

  /**
   * Create 20 test drivers with different locations in Tanta, Egypt
   * Tanta coordinates: approximately 30.7865° N, 31.0004° E
   */
  async createTestDriversInTanta(req: any, res: Response, next: NextFunction) {
    try {
      const createdDrivers = [];
      
      // Base coordinates for Tanta, Egypt
      const tantaBaseCoords = {
        latitude: 30.7865,
        longitude: 31.0004
      };

      // Generate random locations within Tanta (approximately 5km radius)
      const generateTantaLocation = (index: number) => {
        // Create a grid-like pattern with some randomness
        const gridSize = 5; // 5x4 grid for 20 drivers
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        // Offset from base coordinates (approximately 0.01 degree = ~1.1km)
        const latOffset = (row - 2) * 0.008 + (Math.random() - 0.5) * 0.004;
        const lonOffset = (col - 2.5) * 0.008 + (Math.random() - 0.5) * 0.004;
        
        return {
          latitude: tantaBaseCoords.latitude + latOffset,
          longitude: tantaBaseCoords.longitude + lonOffset,
          address: `Tanta Street ${index + 1}, Tanta, Gharbia, Egypt`
        };
      };

      // Tanta area names for more realistic addresses
      const tantaAreas = [
        "Tanta University Area", "El Mahalla Road", "Saeed Street", 
        "El Nasr Street", "El Geish Street", "El Bahr Street",
        "Tanta Railway Station Area", "El Mohandesen Area", "El Doctors Area",
        "El Sabaa Banat", "El Zayat Street", "El Fateh Street",
        "Tanta Medical Complex Area", "El Galaa Street", "El Corniche Street",
        "Tanta Industrial Zone", "El Alfy Street", "El Mahatta Square",
        "Kafr Essam", "Samanoud Road"
      ];

      for (let i = 0; i < 20; i++) {
        const driverNumber = i + 1;
        const location = generateTantaLocation(i);
        const areaName = tantaAreas[i];
        
        // Create fake UID for testing (in real scenario, this comes from Firebase Auth)
        const testUID = `test_driver_${Date.now()}_${driverNumber}`;
        
        const driverData = {
          name: `Test Driver ${driverNumber}`,
          id: testUID,
          email: `testdriver${driverNumber}@tanta.com`,
          phone: `+201${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          currentLocation: null, // Set to null as per model
          status: Math.random() > 0.3 ? DriverStatus.AVAILABLE : DriverStatus.BUSY,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Rating between 3.0 and 5.0
          isActive: true,
          lastLocationUpdate: new Date(),
          createdAt: new Date(),
          rallyPoint: null // Set to null as per model
        };

        // Create DriverModel instance
        const driverModel = new DriverModel(driverData);

        try {
          // Create driver profile
          await this.driverService.createDriver(testUID, driverModel);
          
          // Update location (similar to updateDriverOnLogIn)
          await this.driverService.updateLocation(testUID, location);
          
          // Create location point for the driver
          await this.locationPointService.createDriverLocationPoint({
            driverId: testUID,
            driverName: driverData.name,
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
              address: `${areaName}, Tanta, Gharbia, Egypt`
            },
            phone: driverData.phone,
            status: driverData.status,
            rating: driverData.rating,
          });

          createdDrivers.push({
            id: testUID,
            name: driverModel.name,
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
              address: `${areaName}, Tanta, Gharbia, Egypt`
            },
            status: driverModel.status,
            rating: driverModel.rating,
            phone: driverModel.phone
          });

          console.log(`Created test driver ${driverNumber}/20: ${driverModel.name} at ${areaName}`);
          
        } catch (error) {
          console.error(`Error creating driver ${driverNumber}:`, error);
          // Continue with next driver even if one fails
        }
      }

      ResponseUtil.sendResponse(req, res, {
        message: `Successfully created ${createdDrivers.length} test drivers in Tanta, Egypt`,
        drivers: createdDrivers,
        totalCreated: createdDrivers.length,
        tantaCoordinates: tantaBaseCoords,
        note: "These are test drivers for development purposes only"
      });

    } catch (error) {
      console.error("Error in createTestDriversInTanta:", error);
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  /**
   * Update a test driver's location (similar to updateDriverOnLogIn)
   */
  async updateTestDriverLocation(req: any, res: Response, next: NextFunction) {
    try {
      const { driverId } = req.params;
      const { latitude, longitude, address, notificationToken } = req.body;

      // Update driver login with notification token
      if (notificationToken) {
        await this.driverService.updateDriverOnLogIn(driverId, notificationToken);
      }

      // Update location
      const newLocation = {
        latitude: latitude || 30.7865 + (Math.random() - 0.5) * 0.02,
        longitude: longitude || 31.0004 + (Math.random() - 0.5) * 0.02,
        address: address || `Updated Location in Tanta, Egypt`
      };

      await this.driverService.updateLocation(driverId, newLocation);

      // Get updated driver data
      const updatedDriver = await this.driverService.getDriverById(driverId);
      
      if (!updatedDriver) {
        throw new Error(`Driver with ID ${driverId} not found`);
      }

      // Update location point
      await this.locationPointService.createDriverLocationPoint({
        driverId: updatedDriver.id,
        driverName: updatedDriver.name,
        location: newLocation,
        phone: updatedDriver.phone || "No Phone",
        status: updatedDriver.status,
        rating: updatedDriver.rating || 0,
      });

      ResponseUtil.sendResponse(req, res, {
        message: "Test driver location updated successfully",
        driver: updatedDriver,
        newLocation: newLocation
      });

    } catch (error) {
      console.error("Error in updateTestDriverLocation:", error);
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  /**
   * Clean up all test drivers (for cleanup purposes)
   */
  async cleanupTestDrivers(req: any, res: Response, next: NextFunction) {
    try {
      // This would require additional repo methods to delete drivers
      // For now, just return a message
      ResponseUtil.sendResponse(req, res, {
        message: "Cleanup function not implemented yet. Please manually remove test drivers from database.",
        note: "Test drivers have IDs starting with 'test_driver_'"
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }
}
