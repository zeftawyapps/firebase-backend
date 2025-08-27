import { Application, NextFunction } from "express";
import { DriverLocationTestController } from "../../../app/testing/driver-location-test.controller";

export default function (app: Application) {
  const driverLocationTestController = new DriverLocationTestController();

  /**
   * @swagger
   * /api/v1/test/drivers/create-tanta-drivers:
   *   post:
   *     summary: Create 20 test drivers with location points in Tanta, Egypt
   *     tags: [Testing]
   *     description: Creates 20 test drivers with different locations across Tanta city for testing purposes
   *     responses:
   *       200:
   *         description: Successfully created test drivers
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 drivers:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       name:
   *                         type: string
   *                       location:
   *                         type: object
   *                         properties:
   *                           latitude:
   *                             type: number
   *                           longitude:
   *                             type: number
   *                           address:
   *                             type: string
   *                       status:
   *                         type: string
   *                       rating:
   *                         type: number
   *                       phone:
   *                         type: string
   *                 totalCreated:
   *                   type: number
   *                 tantaCoordinates:
   *                   type: object
   *                   properties:
   *                     latitude:
   *                       type: number
   *                     longitude:
   *                       type: number
   *       500:
   *         description: Internal server error
   */
  app.post(
    "/test/drivers/create-tanta-drivers",
    (req, res, next: NextFunction) => {
      return driverLocationTestController.createTestDriversInTanta(
        req,
        res,
        next
      );
    }
  );

  /**
   * @swagger
   * /api/v1/test/drivers/update-location/{driverId}:
   *   put:
   *     summary: Update test driver location (similar to updateDriverOnLogIn)
   *     tags: [Testing]
   *     parameters:
   *       - in: path
   *         name: driverId
   *         required: true
   *         schema:
   *           type: string
   *         description: The driver ID to update
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               latitude:
   *                 type: number
   *                 description: New latitude (optional, will generate random if not provided)
   *               longitude:
   *                 type: number
   *                 description: New longitude (optional, will generate random if not provided)
   *               address:
   *                 type: string
   *                 description: New address (optional)
   *               notificationToken:
   *                 type: string
   *                 description: Firebase notification token (optional)
   *     responses:
   *       200:
   *         description: Driver location updated successfully
   *       404:
   *         description: Driver not found
   *       500:
   *         description: Internal server error
   */
  app.put(
    "/test/drivers/update-location/:driverId",
    (req, res, next: NextFunction) => {
      return driverLocationTestController.updateTestDriverLocation(
        req,
        res,
        next
      );
    }
  );

  /**
   * @swagger
   * /api/v1/test/drivers/cleanup:
   *   delete:
   *     summary: Clean up all test drivers
   *     tags: [Testing]
   *     description: Remove all test drivers created for testing purposes
   *     responses:
   *       200:
   *         description: Cleanup completed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 deletedDrivers:
   *                   type: number
   *                 deletedLocationPoints:
   *                   type: number
   *                 success:
   *                   type: boolean
   *       500:
   *         description: Internal server error
   */
  app.delete("/test/drivers/cleanup", (req, res, next: NextFunction) => {
    return driverLocationTestController.cleanupTestDrivers(req, res, next);
  });

  /**
   * @swagger
   * /api/v1/test/drivers/list:
   *   get:
   *     summary: Get all test drivers
   *     tags: [Testing]
   *     description: Retrieve a list of all test drivers
   *     responses:
   *       200:
   *         description: Test drivers retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 drivers:
   *                   type: array
   *                   items:
   *                     type: object
   *                 count:
   *                   type: number
   *       500:
   *         description: Internal server error
   */
  app.get("/test/drivers/list", (req, res, next: NextFunction) => {
    return driverLocationTestController.getTestDrivers(req, res, next);
  });

  /**
   * @swagger
   * /api/v1/test/drivers/delete/{driverId}:
   *   delete:
   *     summary: Delete a specific test driver
   *     tags: [Testing]
   *     parameters:
   *       - in: path
   *         name: driverId
   *         required: true
   *         schema:
   *           type: string
   *         description: The test driver ID to delete (must start with 'test_driver_')
   *     responses:
   *       200:
   *         description: Test driver deleted successfully
   *       400:
   *         description: Invalid driver ID (not a test driver)
   *       404:
   *         description: Driver not found
   *       500:
   *         description: Internal server error
   */
  app.delete(
    "/test/drivers/delete/:driverId",
    (req, res, next: NextFunction) => {
      return driverLocationTestController.deleteTestDriver(req, res, next);
    }
  );
}
