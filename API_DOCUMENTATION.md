# Firebase Backend API Documentation

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Shop Routes](#shop-routes)
- [Driver Routes](#driver-routes)
- [Location Point Routes](#location-point-routes)
- [Landing Page Routes](#landing-page-routes)

## Getting Started

### Base URL
- **Local Development**: `http://127.0.0.1:5001/shipping-app-ead85/europe-west3/apiShippingApp`
- **Production**: `https://europe-west3-shipping-app-ead85.cloudfunctions.net/apiShippingApp`

### Common Headers
All requests require the following headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

## Authentication

All API endpoints require JWT authentication. Include your JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Shop Routes

### 1. Create Shop
- **Method**: `POST`
- **URL**: `/shop`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "name": "My Coffee Shop",
    "description": "Best coffee in town",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St, New York, NY",
      "city": "New York",
      "country": "USA"
    },
    "address": "123 Main St, New York, NY 10001",
    "phone": "+1-555-123-4567"
  }
  ```

### 2. Update Shop
- **Method**: `PUT`
- **URL**: `/shop`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "name": "Updated Coffee Shop Name",
    "description": "Updated description",
    "address": "456 New Address St",
    "phone": "+1-555-987-6543"
  }
  ```

### 3. Get Shop by ID
- **Method**: `GET`
- **URL**: `/shop/{shopId}`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **URL Parameters**:
  - `shopId`: The unique ID of the shop
- **Example**: `/shop/shop123456`

### 4. Get Current User's Shop Profile
- **Method**: `GET`
- **URL**: `/shop/profile`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

### 5. Get All Active Shops
- **Method**: `GET`
- **URL**: `/shops`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

### 6. Toggle Shop Status
- **Method**: `PATCH`
- **URL**: `/shop/toggle-status`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "isActive": true
  }
  ```

### 7. Update Shop Location
- **Method**: `PUT`
- **URL**: `/shop/location`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "location": {
      "latitude": 40.7589,
      "longitude": -73.9851,
      "address": "Times Square, New York, NY",
      "city": "New York",
      "country": "USA"
    },
    "address": "Times Square, New York, NY 10036"
  }
  ```

## Driver Routes

### 1. Create Driver
- **Method**: `POST`
- **URL**: `/driver`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Driver St, New York, NY"
    },
    "rallyPoint": {
      "latitude": 40.7589,
      "longitude": -73.9851,
      "address": "Times Square, New York, NY"
    }
  }
  ```

### 2. Get Driver Profile
- **Method**: `GET`
- **URL**: `/driver/profile`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

### 3. Update Driver Location
- **Method**: `PUT`
- **URL**: `/driver/location`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "latitude": 40.7831,
    "longitude": -73.9712,
    "address": "Central Park, New York, NY"
  }
  ```

### 4. Update Driver Status
- **Method**: `PUT`
- **URL**: `/driver/status`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "status": "available"
  }
  ```
- **Available Status Values**:
  - `"available"`
  - `"busy"`
  - `"at_rally_point"`
  - `"offline"`

### 5. Set Rally Point
- **Method**: `PUT`
- **URL**: `/driver/rally-point`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "rallyPoint": {
      "latitude": 40.7505,
      "longitude": -73.9934,
      "address": "Penn Station, New York, NY"
    }
  }
  ```

### 6. Update Driver Rating
- **Method**: `PUT`
- **URL**: `/driver/rating`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "driverId": "driver123456",
    "rating": 4.8
  }
  ```

## Location Point Routes

### 1. Update Location Point
- **Method**: `PUT`
- **URL**: `/location-point/{id}`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **URL Parameters**:
  - `id`: The unique ID of the location point
- **Body (JSON)**:
  ```json
  {
    "name": "Updated Location Point",
    "description": "Updated description",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "Updated Address",
      "city": "New York",
      "country": "USA"
    },
    "isActive": true
  }
  ```

### 2. Update Driver Location
- **Method**: `PUT`
- **URL**: `/location-point/driver/{driverId}`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **URL Parameters**:
  - `driverId`: The unique ID of the driver
- **Body (JSON)**:
  ```json
  {
    "latitude": 40.7831,
    "longitude": -73.9712,
    "address": "Central Park, New York, NY",
    "status": "available"
  }
  ```

### 3. Update Order Status in Location Points
- **Method**: `PUT`
- **URL**: `/location-point/order/status`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN
  ```
- **Body (JSON)**:
  ```json
  {
    "orderId": "order123456",
    "newStatus": "delivered"
  }
  ```

## Landing Page Routes

### 1. Get Landing Page
- **Method**: `GET`
- **URL**: `/landingPage`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

### 2. Get Dashboard
- **Method**: `GET`
- **URL**: `/dashboard`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

## Postman Setup Instructions

### 1. Environment Variables
Create a Postman environment with these variables:
- `baseUrl`: `http://localhost:5001/firebase-backend/us-central1/app` (for local)
- `authToken`: Your JWT token

### 2. Collection Setup
1. Create a new collection called "Firebase Backend API"
2. In the collection settings, add Authorization:
   - Type: Bearer Token
   - Token: `{{authToken}}`

### 3. Request Template
For each request:
1. Set the method (GET, POST, PUT, PATCH, DELETE)
2. Set the URL: `{{baseUrl}}/endpoint`
3. Add headers if needed:
   - `Content-Type: application/json`
4. Add the request body (for POST/PUT requests)

### 4. Common Response Format
All successful responses follow this format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Status Codes
- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid or missing token)
- `404`: Not Found
- `500`: Internal Server Error

## Tips for Testing

1. **Authentication**: Always include the Bearer token in your requests
2. **Content-Type**: Set `Content-Type: application/json` for POST/PUT requests
3. **Body Format**: Ensure JSON is valid and properly formatted
4. **Required Fields**: Check validation rules for required fields
5. **Data Types**: Match data types (string, number, boolean) as specified

## Example Postman Collection Structure
```
Firebase Backend API/
├── Authentication/
│   └── Get Auth Token
├── Shop Management/
│   ├── Create Shop
│   ├── Update Shop
│   ├── Get Shop Profile
│   ├── Get Shop by ID
│   ├── Get All Shops
│   ├── Toggle Shop Status
│   └── Update Shop Location
├── Driver Management/
│   ├── Create Driver
│   ├── Get Driver Profile
│   ├── Update Driver Location
│   ├── Update Driver Status
│   ├── Set Rally Point
│   └── Update Driver Rating
├── Location Points/
│   ├── Update Location Point
│   ├── Update Driver Location
│   └── Update Order Status
└── Landing/
    ├── Get Landing Page
    └── Get Dashboard
```
