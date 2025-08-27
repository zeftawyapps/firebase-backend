# Driver Location Testing API

This testing API allows you to create and manage test drivers with location points in Tanta, Egypt for development and testing purposes.

## Features

- Creates 20 test drivers with different locations spread across Tanta city
- Each driver has a unique location within Tanta's boundaries
- Includes realistic Egyptian phone numbers and addresses
- Automatically creates location points for each driver with notification tokens
- Mimics the `updateDriverOnLogIn` functionality
- **Full CRUD operations**: Create, Read, Update, and Delete test drivers
- **Cleanup functionality**: Remove all test drivers at once
- **Individual deletion**: Delete specific test drivers by ID

## API Endpoints

### 1. Create Test Drivers in Tanta

**POST** `/test/drivers/create-tanta-drivers`

Creates 20 test drivers with different locations across Tanta, Egypt.

**Response:**

```json
{
  "message": "Successfully created 20 test drivers in Tanta, Egypt",
  "drivers": [
    {
      "id": "test_driver_1234567890_1",
      "name": "Test Driver 1",
      "location": {
        "latitude": 30.7865,
        "longitude": 31.0004,
        "address": "Tanta University Area, Tanta, Gharbia, Egypt"
      },
      "status": "available",
      "rating": 4.2,
      "phone": "+201234567890"
    }
  ],
  "totalCreated": 20,
  "tantaCoordinates": {
    "latitude": 30.7865,
    "longitude": 31.0004
  }
}
```

### 2. Update Test Driver Location

**PUT** `/test/drivers/update-location/:driverId`

Updates a test driver's location, similar to the `updateDriverOnLogIn` function.

**Request Body:**

```json
{
  "latitude": 30.79,
  "longitude": 31.005,
  "address": "New Location in Tanta",
  "notificationToken": "firebase_token_here"
}
```

### 3. Get All Test Drivers

**GET** `/test/drivers/list`

Retrieves a list of all test drivers currently in the system.

**Response:**

```json
{
  "message": "Found 20 test drivers",
  "drivers": [
    {
      "id": "doc_id",
      "uid": "test_driver_1234567890_1",
      "name": "Test Driver 1",
      "status": "available",
      "rating": 4.2,
      "phone": "+201234567890"
    }
  ],
  "count": 20
}
```

### 4. Delete All Test Drivers (Cleanup)

**DELETE** `/test/drivers/cleanup`

Removes all test drivers and their associated location points from the system.

**Response:**

```json
{
  "message": "Cleanup completed. Deleted 20 drivers and 20 location points.",
  "deletedDrivers": 20,
  "deletedLocationPoints": 20,
  "deletedDriversList": [
    "test_driver_1234567890_1",
    "test_driver_1234567890_2"
  ],
  "errors": [],
  "totalFound": 20,
  "success": true
}
```

### 5. Delete Specific Test Driver

**DELETE** `/test/drivers/delete/:driverId`

Deletes a specific test driver by ID (only works with test driver IDs).

**Response:**

```json
{
  "message": "Test driver test_driver_1234567890_1 deleted successfully",
  "deletedDriverId": "test_driver_1234567890_1",
  "success": true
}
```

## Tanta City Information

- **Base Coordinates:** 30.7865° N, 31.0004° E
- **Governorate:** Gharbia, Egypt
- **Coverage Area:** ~5km radius from city center
- **Driver Distribution:** Grid pattern with randomization

## Areas Covered

The test drivers are distributed across various areas in Tanta:

- Tanta University Area
- El Mahalla Road
- Saeed Street
- El Nasr Street
- El Geish Street
- Railway Station Area
- Medical Complex Area
- Industrial Zone
- And more...

## Usage Notes

1. **Test Driver IDs:** All test drivers have IDs starting with `test_driver_` followed by a timestamp and number
2. **Realistic Data:** Phone numbers use Egyptian format (+201xxxxxxxx)
3. **Location Points:** Each driver automatically gets a location point created with notification token
4. **Status Distribution:** ~70% available, ~30% busy drivers
5. **Ratings:** Random ratings between 3.0 and 5.0
6. **Notification Tokens:** Fake notification tokens are generated for testing push notifications
7. **Metadata Storage:** Driver info including phone, status, rating, and notification token stored in location point metadata

## Development Use Cases

- Testing location-based features
- Simulating driver distribution
- Testing driver search algorithms
- Load testing with realistic data
- UI/UX testing with populated maps

## Important Notes

⚠️ **This API is for testing purposes only!**

- Do not use in production
- Clean up test data regularly
- Test drivers are clearly marked with `test_driver_` prefix
