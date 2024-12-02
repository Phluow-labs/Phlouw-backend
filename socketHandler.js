// socketHandler.js

let io;
let driverSockets = {}; // Map to store driverId to socketId mappings

// Add a setter for io
const setIoInstance = (socketIoInstance) => {
  io = socketIoInstance;
};

// Listen for driver connections and store their socketId by driverId
const initializeSocketHandlers = () => {
  io.on('connection', (socket) => {
    console.log('A driver connected:', socket.id);

    socket.on('registerDriver', (driverId) => {
      driverSockets[driverId] = socket.id; // Store the socketId by driverId
      console.log(`Driver ${driverId} registered with socket ID: ${socket.id}`);
    });

    socket.on('disconnect', () => {
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

// Export the setter and the socket handler
module.exports = { setIoInstance, initializeSocketHandlers };
