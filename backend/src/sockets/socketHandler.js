const { Server } = require('socket.io');

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // authentication: client should emit 'authenticate' with { userId }
    socket.on('authenticate', (payload) => {
      if (!payload || !payload.userId) return;
      socket.join(`user:${payload.userId}`);
      socket.userId = payload.userId;
      console.log(`socket ${socket.id} joined user:${payload.userId}`);
    });

    // join a task room (for live watchers / annotation)
    socket.on('joinTask', (payload) => {
      if (!payload || !payload.taskId) return;
      socket.join(`task:${payload.taskId}`);
      console.log(`socket ${socket.id} joined task:${payload.taskId}`);
    });

    // simple broadcast: annotation events within a task room
    socket.on('task:annotate', (payload) => {
      // payload: { taskId, annotation }
      if (!payload || !payload.taskId) return;
      io.to(`task:${payload.taskId}`).emit('task:annotation', payload.annotation);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });

  return io;
}

module.exports = { initSocket };
