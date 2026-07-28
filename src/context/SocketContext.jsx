import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let socketInstance = null;
    if (isAuthenticated) {
      const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      socketInstance = io(serverUrl, {
        transports: ['websocket', 'polling']
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected successfully:', socketInstance.id);
      });

      setSocket(socketInstance);
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Join a project real-time room
  const joinProject = (projectId) => {
    if (socket && projectId) {
      socket.emit('joinProject', projectId);
    }
  };

  // Leave a project real-time room
  const leaveProject = (projectId) => {
    if (socket && projectId) {
      socket.emit('leaveProject', projectId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinProject, leaveProject }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
