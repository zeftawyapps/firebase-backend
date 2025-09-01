# 🔧 Notification System Integration Guide

## Adding Notification Routes to Main Router

To complete the notification system setup, you need to add the notification routes to your main router configuration.

### 1. Import Notification Routes

Add this import to your main router file (usually `route/v1/index.ts` or similar):

```typescript
import notificationRoutes from "./app/notification.routes";
```

### 2. Add Route to Router

Add this line to register the notification routes:

```typescript
router.use("/notification", notificationRoutes);
```

### Example Main Router File

```typescript
import * as express from "express";
import userRoutes from "./app/user.routes";
import orderRoutes from "./app/order.routes";
import driverRoutes from "./app/driver.routes";
import notificationRoutes from "./app/notification.routes"; // ADD THIS

const router = express.Router();

router.use("/user", userRoutes);
router.use("/order", orderRoutes);
router.use("/driver", driverRoutes);
router.use("/notification", notificationRoutes); // ADD THIS

export default router;
```

## Testing the Complete System

### 1. Create a Test Order

```bash
POST /order
{
  "shopId": "shop123",
  "senderDetails": {
    "name": "Test Shop",
    "phone": "+201234567890",
    "address": "123 Test Street, Tanta, Egypt",
    "latitude": 30.7865,
    "longitude": 31.0004,
    "notes": "Test pickup location"
  },
  "recipientDetails": {
    "name": "Test Customer",
    "phone": "+201234567891",
    "address": "456 Customer Street, Tanta, Egypt",
    "latitude": 30.7900,
    "longitude": 31.0050,
    "notes": "Test delivery location"
  },
  "items": [
    {
      "id": "item1",
      "name": "Test Product",
      "description": "Test product description",
      "quantity": 2,
      "unitPrice": 50.00,
      "weight": 1.5
    }
  ]
}
```

### 2. Find Nearby Drivers (This will trigger notifications)

```bash
GET /order/{orderId}/nearby-drivers?radius=10
```

### 3. Check Notifications Were Created

```bash
GET /notification/order/{orderId}
```

### 4. Check Driver Received Notifications

```bash
GET /notification/driver/{driverId}
GET /notification/driver/{driverId}/unread
```

## Environment Variables for FCM

Make sure you have these Firebase configurations in your environment:

```typescript
// Firebase configuration should already be set up
// FCM will use the same Firebase Admin SDK configuration
```

## Driver FCM Token Setup

Ensure drivers have FCM tokens stored in their LocationPoint metadata:

```typescript
// When creating/updating driver location
{
  metadata: {
    phone: "+201234567890",
    status: "available",
    rating: 4.5,
    notificationToken: "fcm_token_here" // Required for notifications
  }
}
```

## Monitoring Notifications

### Check Notification Status

```bash
# Get all notifications for debugging
GET /notification/order/{orderId}

# Check if driver received notifications
GET /notification/driver/{driverId}/unread
```

### Resend Failed Notifications

```bash
POST /notification/{notificationId}/resend
```

## Production Considerations

### 1. FCM Token Management

- Implement token refresh mechanism in driver app
- Handle token expiration and renewal
- Update driver location metadata when token changes

### 2. Notification Preferences

- Allow drivers to set notification preferences
- Implement quiet hours for notifications
- Add notification frequency limits

### 3. Performance Optimization

- Batch notifications for high-volume scenarios
- Implement notification queuing for reliability
- Add retry mechanisms for failed deliveries

### 4. Analytics

- Track notification delivery rates
- Monitor driver response times
- Analyze notification effectiveness

The notification system is now fully integrated and ready for testing! 🎉
