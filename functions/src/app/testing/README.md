# Driver Location Testing API

This testing API allows you to create and manage test drivers with location points in Tanta, Egypt for development and testing purposes.

## Features

- Creates 20 test drivers with different locations spread across Tanta city
- Each driver has a unique location within Tanta's boundaries
- Includes realistic Egyptian phone numbers and addresses
- Automatically creates location points for each driver
- Mimics the `updateDriverOnLogIn` functionality

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
  "latitude": 30.7900,
  "longitude": 31.0050,
  "address": "New Location in Tanta",
  "notificationToken": "firebase_token_here"
}
```

### 3. Cleanup Test Drivers
**DELETE** `/test/drivers/cleanup`

Provides information about cleaning up test drivers (implementation pending).

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
3. **Location Points:** Each driver automatically gets a location point created
4. **Status Distribution:** ~70% available, ~30% busy drivers
5. **Ratings:** Random ratings between 3.0 and 5.0

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
