import * as express from "express";
import { NotificationController } from "../../../app/notification/notification.controller";

const router = express.Router();
const notificationController = new NotificationController();

/**
 * @swagger
 * /notification/driver/{driverId}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get all notifications for a driver
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The driver ID
 *     responses:
 *       200:
 *         description: Driver notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get("/driver/:driverId", notificationController.getDriverNotifications);

/**
 * @swagger
 * /notification/driver/{driverId}/unread:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get unread notifications for a driver
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The driver ID
 *     responses:
 *       200:
 *         description: Unread notifications retrieved successfully
 */
router.get(
  "/driver/:driverId/unread",
  notificationController.getUnreadNotifications
);

/**
 * @swagger
 * /notification/order/{orderId}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get all notifications for an order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order notifications retrieved successfully
 */
router.get("/order/:orderId", notificationController.getOrderNotifications);

/**
 * @swagger
 * /notification/{notificationId}/read:
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Mark notification as read
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 */
router.put("/:notificationId/read", notificationController.markAsRead);

/**
 * @swagger
 * /notification/{notificationId}/delivered:
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Mark notification as delivered
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification marked as delivered successfully
 */
router.put(
  "/:notificationId/delivered",
  notificationController.markAsDelivered
);

/**
 * @swagger
 * /notification/{notificationId}/resend:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Resend a failed notification
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification resent successfully
 */
router.post(
  "/:notificationId/resend",
  notificationController.resendNotification
);

/**
 * @swagger
 * /notification/{notificationId}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Delete a notification
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete("/:notificationId", notificationController.deleteNotification);

export default router;
