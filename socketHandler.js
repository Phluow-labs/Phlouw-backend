let io;
let driverSockets = {}; // Map to store driverId to socketId mappings

const setIoInstance = (socketIoInstance) => {
  io = socketIoInstance;
};

const initializeSocketHandlers = () => {
  if (!io) {
    throw new Error("Socket.io instance is not set. Call setIoInstance first.");
  }

  io.on("connection", (socket) => {
    console.log("A driver connected:", socket.id);

    // Listen for when a driver registers their driverId
    socket.on("registerDriver", (driverId) => {
      driverSockets[driverId] = socket.id; // Store the socketId by driverId
      console.log(`Driver ${driverId} registered with socket ID: ${socket.id}`);
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

const sendOrderToDriver = (driverId, order) => {
  const socketId = driverSockets[driverId];
  if (socketId && io) {
    io.to(socketId).emit("newOrder", { order });
    console.log(`New order sent to driver: ${driverId}`);
  } else {
    console.log(`Driver ${driverId} not connected or no socketId found`);
  }
};

module.exports = { setIoInstance, initializeSocketHandlers, sendOrderToDriver };
