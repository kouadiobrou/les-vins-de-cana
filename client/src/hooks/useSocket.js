import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useSnackbar } from './useSnackbar';

export const useSocket = () => {
  const socket = useRef(null);
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (token) {
      // Initialize socket connection
      socket.current = io(process.env.REACT_APP_API_URL || 'http://localhost', {
        auth: { token }
      });

      // Connect socket
      socket.current.connect();

      // Handle payment events
      socket.current.on('payment:success', (data) => {
        showSnackbar({
          message: `Payment of ${data.amount} ${data.currency} confirmed!`,
          severity: 'success',
          autoHideDuration: 5000
        });
      });

      socket.current.on('payment:error', (data) => {
        showSnackbar({
          message: data.message,
          severity: 'error',
          autoHideDuration: 5000
        });
      });

      // Cleanup function
      return () => {
        if (socket.current) {
          socket.current.off('payment:success');
          socket.current.off('payment:error');
          socket.current.disconnect();
        }
      };
    }
  }, [token, showSnackbar]);

  return socket.current;
};

export default useSocket;
