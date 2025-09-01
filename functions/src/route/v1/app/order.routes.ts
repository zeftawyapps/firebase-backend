import { Application, NextFunction } from "express";
import { OrderController } from "../../../app/order/order.contraller";
import { userAuthMiddleware } from "../../../app/middleware/user-auth.middleware";

export default function (app: Application) {
  const orderController = new OrderController();

  /**
   * @swagger
   * /order:
   *   post:
   *     summary: Create a new order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               shopId:
   *                 type: string
   *                 description: ID of the shop creating the order
   *               senderDetails:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   phone:
   *                     type: string
   *                   address:
   *                     type: string
   *                   latitude:
   *                     type: number
   *                   longitude:
   *                     type: number
   *                   notes:
   *                     type: string
   *               recipientDetails:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   phone:
   *                     type: string
   *                   address:
   *                     type: string
   *                   latitude:
   *                     type: number
   *                   longitude:
   *                     type: number
   *                   notes:
   *                     type: string
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     description:
   *                       type: string
   *                     quantity:
   *                       type: number
   *                     unitPrice:
   *                       type: number
   *                     weight:
   *                       type: number
   *     responses:
   *       200:
   *         description: Order created successfully
   *       400:
   *         description: Invalid request data
   *       401:
   *         description: Unauthorized
   */
  app.post("/order", userAuthMiddleware, (req, res, next: NextFunction) => {
    return orderController.createOrder(req, res, next);
  });

  /**
   * @swagger
   * /order/{orderId}:
   *   put:
   *     summary: Update an existing order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [pending, accepted, pickedUp, inTransit, delivered, cancelled, rejected]
   *               driverId:
   *                 type: string
   *               cancellationReason:
   *                 type: string
   *     responses:
   *       200:
   *         description: Order updated successfully
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.put("/order/:id", userAuthMiddleware, (req, res, next: NextFunction) => {
    return orderController.updateOrder(req, res, next);
  });

  /**
   * @swagger
   * /order/{orderId}:
   *   get:
   *     summary: Get order by ID
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *     responses:
   *       200:
   *         description: Order retrieved successfully
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.get("/order/:id", userAuthMiddleware, (req, res, next: NextFunction) => {
    return orderController.getSingleOrder(req, res, next);
  });

  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: Get orders for the authenticated user
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, accepted, pickedUp, inTransit, delivered, cancelled, rejected]
   *         description: Filter orders by status
   *       - in: query
   *         name: shopId
   *         schema:
   *           type: string
   *         description: Filter orders by shop ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *         description: Number of orders to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: number
   *         description: Number of orders to skip
   *     responses:
   *       200:
   *         description: Orders retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  app.get("/orders", userAuthMiddleware, (req, res, next: NextFunction) => {
    return orderController.getOrders(req, res, next);
  });

  /**
   * @swagger
   * /order/{orderId}/status:
   *   patch:
   *     summary: Update order status
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [pending, accepted, pickedUp, inTransit, delivered, cancelled, rejected]
   *               driverId:
   *                 type: string
   *                 description: Required when status is accepted
   *               cancellationReason:
   *                 type: string
   *                 description: Required when status is cancelled or rejected
   *     responses:
   *       200:
   *         description: Order status updated successfully
   *       400:
   *         description: Invalid status transition
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.patch(
    "/order/:id/status",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.updateOrderStatus(req, res, next);
    }
  );

  /**
   * @swagger
   * /order/{orderId}/accept:
   *   post:
   *     summary: Accept an order (for drivers)
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *     responses:
   *       200:
   *         description: Order accepted successfully
   *       400:
   *         description: Order cannot be accepted
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.post(
    "/order/:id/accept",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.acceptOrder(req, res, next);
    }
  );

  /**
   * @swagger
   * /order/{orderId}/pickup:
   *   post:
   *     summary: Mark order as picked up (for drivers)
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *     responses:
   *       200:
   *         description: Order marked as picked up
   *       400:
   *         description: Order cannot be picked up
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.post(
    "/order/:id/pickup",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.pickupOrder(req, res, next);
    }
  );

  /**
   * @swagger
   * /order/{orderId}/deliver:
   *   post:
   *     summary: Mark order as delivered (for drivers)
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *     responses:
   *       200:
   *         description: Order marked as delivered
   *       400:
   *         description: Order cannot be delivered
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.post(
    "/order/:id/deliver",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.deliverOrder(req, res, next);
    }
  );

  /**
   * @swagger
   * /order/{orderId}/cancel:
   *   post:
   *     summary: Cancel an order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               reason:
   *                 type: string
   *                 description: Reason for cancellation
   *     responses:
   *       200:
   *         description: Order cancelled successfully
   *       400:
   *         description: Order cannot be cancelled
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.post(
    "/order/:id/cancel",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.cancelOrder(req, res, next);
    }
  );

  /**
   * @swagger
   * /orders/driver:
   *   get:
   *     summary: Get orders assigned to the current driver
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [accepted, pickedUp, inTransit, delivered]
   *         description: Filter orders by status
   *     responses:
   *       200:
   *         description: Driver orders retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  app.get(
    "/orders/driver",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.getDriverOrders(req, res, next);
    }
  );

  /**
   * @swagger
   * /orders/shop:
   *   get:
   *     summary: Get orders for the current shop
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, accepted, pickedUp, inTransit, delivered, cancelled, rejected]
   *         description: Filter orders by status
   *     responses:
   *       200:
   *         description: Shop orders retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  app.get(
    "/orders/shop",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.getShopOrders(req, res, next);
    }
  );

  /**
   * @swagger
   * /order/{orderId}/nearby-drivers:
   *   get:
   *     summary: Find nearby drivers for a pending order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: The order ID
   *       - in: query
   *         name: radius
   *         schema:
   *           type: number
   *           default: 10
   *         description: Search radius in kilometers
   *     responses:
   *       200:
   *         description: Nearby drivers found successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 orderId:
   *                   type: string
   *                 orderLocation:
   *                   type: object
   *                   properties:
   *                     latitude:
   *                       type: number
   *                     longitude:
   *                       type: number
   *                     address:
   *                       type: string
   *                 searchRadius:
   *                   type: number
   *                 totalDriversFound:
   *                   type: number
   *                 availableDrivers:
   *                   type: number
   *                 drivers:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       driverId:
   *                         type: string
   *                       name:
   *                         type: string
   *                       phone:
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
   *                       rating:
   *                         type: number
   *                       status:
   *                         type: string
   *                       notificationToken:
   *                         type: string
   *       400:
   *         description: Order must be in pending status or validation error
   *       404:
   *         description: Order not found
   *       401:
   *         description: Unauthorized
   */
  app.get(
    "/order/:id/nearby-drivers",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return orderController.findNearbyDriversForOrder(req, res, next);
    }
  );
}
