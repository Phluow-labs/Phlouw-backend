let io;
let driverSockets = {}; // Stores the mapping of driverId to socketId
const Driver = require("./models/Driver"); // Import your Driver model

// Function to set the socket.io instance
const setIoInstance = (socketIoInstance) => {
  io = socketIoInstance;
};

// Initialize socket handlers
const initializeSocketHandlers = () => {
  if (!io) {
    throw new Error("Socket.io instance is not set. Call setIoInstance first.");
  }

  io.on("connection", (socket) => {
    console.log("A driver connected:", socket.id);

    // Listen for when a driver sends their driverId
    socket.on("registerDriver", async (driverId) => {
      try {
        // Find driver from the database using driverId
        const driver = await Driver.findById(driverId);
        if (!driver) {
          console.log(`Driver with ID ${driverId} not found`);
          return;
        }

        // Store the driverId to socketId mapping
        driverSockets[driverId] = socket.id;
        console.log(`Driver ${driverId} registered with socket ID: ${socket.id}`);
      } catch (error) {
        console.error("Error registering driver:", error);
      }
    });

    // Handle driver disconnection
    socket.on("disconnect", () => {
      for (let driverId in driverSockets) {
        if (driverSockets[driverId] === socket.id) {
          delete driverSockets[driverId];
          console.log(`Driver ${driverId} disconnected`);
          break;
        }
      }
    });
  });
};

// Function to send an order to a specific driver
const sendOrderToDriver = (driverId, order) => {
  const socketId = driverSockets[driverId]; // Get the socketId for the driver
  if (socketId && io) {
    io.to(socketId).emit("newOrder", { order });
    console.log(`New order sent to driver: ${driverId}`);
  } else {
    console.log(`Driver ${driverId} not connected or no socketId found`);
  }
};

module.exports = { setIoInstance, initializeSocketHandlers, sendOrderToDriver };
