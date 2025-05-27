import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import io from 'socket.io-client';

const API_URL = 'https://meetz-api.onrender.com';
const socket = io(API_URL, { transports: ['websocket'] });

const NotificationContext = createContext();

export const NotificationProvider = ({ children, userProfile, token }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!userProfile?._id || !token) return;

    // Join the user's notification room
    socket.emit('joinUser', userProfile._id);

    // Listen for new message notifications
    socket.on('newMessageNotification', async (data) => {
      const { senderId, text, chatId } = data;
      try {
        // Fetch the sender's details to get their firstName
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/users/${senderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const sender = await response.json();
        const senderName = sender.firstName || senderId; // Fallback to senderId if firstName is unavailable
        setNotification({
          message: `New message from ${senderName}: ${text}`,
          chatId,
        });
      } catch (err) {
        console.error('Error fetching sender details:', err);
        // Fallback to senderId if the fetch fails
        setNotification({
          message: `New message from ${senderId}: ${text}`,
          chatId,
        });
      }
    });

    return () => {
      socket.off('newMessageNotification');
    };
  }, [userProfile, token]);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ setNotification }}>
      {children}
      {notification && (
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);