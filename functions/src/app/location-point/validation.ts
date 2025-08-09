// LocationPoint validation schemas
export const locationPointValidation = {
  // Create LocationPoint validation
  create: {
    locationId: { required: true, type: "string", minLength: 1 },
    name: { required: true, type: "string", minLength: 1, maxLength: 100 },
    description: { required: false, type: "string", maxLength: 500 },
    location: {
      required: true,
      type: "object",
      properties: {
        latitude: { required: true, type: "number", min: -90, max: 90 },
        longitude: { required: true, type: "number", min: -180, max: 180 },
        address: { required: false, type: "string", maxLength: 200 },
        city: { required: false, type: "string", maxLength: 100 },
        country: { required: false, type: "string", maxLength: 100 },
      },
    },
    type: {
      required: true,
      type: "string",
      enum: ["driver", "shop", "order_pickup", "order_delivery"],
    },
    entityId: { required: false, type: "string" },
    metadata: { required: false, type: "object" },
    isActive: { required: false, type: "boolean", default: true },
  },

  // Update LocationPoint validation
  update: {
    name: { required: false, type: "string", minLength: 1, maxLength: 100 },
    description: { required: false, type: "string", maxLength: 500 },
    location: {
      required: false,
      type: "object",
      properties: {
        latitude: { required: false, type: "number", min: -90, max: 90 },
        longitude: { required: false, type: "number", min: -180, max: 180 },
        address: { required: false, type: "string", maxLength: 200 },
        city: { required: false, type: "string", maxLength: 100 },
        country: { required: false, type: "string", maxLength: 100 },
      },
    },
    type: {
      required: false,
      type: "string",
      enum: ["driver", "shop", "order_pickup", "order_delivery"],
    },
    entityId: { required: false, type: "string" },
    metadata: { required: false, type: "object" },
    isActive: { required: false, type: "boolean" },
  },

  // Create Driver Location Point validation
  createDriver: {
    driverId: { required: true, type: "string", minLength: 1 },
    driverName: { required: true, type: "string", minLength: 1, maxLength: 50 },
    location: {
      required: true,
      type: "object",
      properties: {
        latitude: { required: true, type: "number", min: -90, max: 90 },
        longitude: { required: true, type: "number", min: -180, max: 180 },
        address: { required: false, type: "string", maxLength: 200 },
      },
    },
    phone: { required: false, type: "string" },
    status: { required: false, type: "string" },
    rating: { required: false, type: "number", min: 0, max: 5 },
  },

  // Create Shop Location Point validation
  createShop: {
    shopId: { required: true, type: "string", minLength: 1 },
    shopName: { required: true, type: "string", minLength: 1, maxLength: 100 },
    location: {
      required: true,
      type: "object",
      properties: {
        latitude: { required: true, type: "number", min: -90, max: 90 },
        longitude: { required: true, type: "number", min: -180, max: 180 },
        address: { required: false, type: "string", maxLength: 200 },
      },
    },
    address: { required: false, type: "string", maxLength: 200 },
    phone: { required: false, type: "string" },
    isActive: { required: false, type: "boolean" },
  },

  // Create Order Pickup Location Point validation
  createOrderPickup: {
    orderId: { required: true, type: "string", minLength: 1 },
    shopName: { required: true, type: "string", minLength: 1, maxLength: 100 },
    location: {
      required: true,
      type: "object",
      properties: {
        latitude: { required: true, type: "number", min: -90, max: 90 },
        longitude: { required: true, type: "number", min: -180, max: 180 },
        address: { required: false, type: "string", maxLength: 200 },
      },
    },
    customerName: { required: false, type: "string", maxLength: 50 },
    orderStatus: { required: false, type: "string" },
    totalPrice: { required: false, type: "number", min: 0 },
  },

  // Create Order Delivery Location Point validation
  createOrderDelivery: {
    orderId: { required: true, type: "string", minLength: 1 },
    customerName: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
    location: {
      required: true,
      type: "object",
      properties: {
        latitude: { required: true, type: "number", min: -90, max: 90 },
        longitude: { required: true, type: "number", min: -180, max: 180 },
        address: { required: false, type: "string", maxLength: 200 },
      },
    },
    address: { required: false, type: "string", maxLength: 200 },
    phone: { required: false, type: "string" },
    orderStatus: { required: false, type: "string" },
    totalPrice: { required: false, type: "number", min: 0 },
  },

  // Update location coordinates validation
  updateCoordinates: {
    latitude: { required: true, type: "number", min: -90, max: 90 },
    longitude: { required: true, type: "number", min: -180, max: 180 },
    address: { required: false, type: "string", maxLength: 200 },
  },

  // Search validation
  search: {
    searchTerm: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
  },

  // Nearby location points validation
  nearby: {
    latitude: { required: true, type: "number", min: -90, max: 90 },
    longitude: { required: true, type: "number", min: -180, max: 180 },
    radiusKm: {
      required: false,
      type: "number",
      min: 0.1,
      max: 100,
      default: 10,
    },
  },

  // Toggle active status validation
  toggleActive: {
    id: { required: true, type: "string", minLength: 1 },
  },

  // Update order status validation
  updateOrderStatus: {
    orderId: { required: true, type: "string", minLength: 1 },
    newStatus: { required: true, type: "string", minLength: 1, maxLength: 50 },
  },
};
