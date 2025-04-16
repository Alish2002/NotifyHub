// import React, { useState, useEffect } from 'react';
// import './index.css';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const token = localStorage.getItem('accessToken'); 
const socket = io('http://localhost:4000', {
  auth: {token,},
});

const App = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('accessToken'); 

      const response = await fetch('http://localhost:4000/notifications', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('data', data);
      setNotifications(data);
    };
    // Fetch initial notifications from the server
    fetchNotifications();

    // Listen for new notifications
    socket.on('notification', (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('notification');
    };
  }, []);

return (
  <Container>
    <GlassEffect>
      <Header>
        <Title>🔔 Notification Center</Title>
        <Subtitle>Stay updated in real time</Subtitle>
      </Header>

      <NotificationWrapper>
        <NotificationHeader>📩 Recent Notifications</NotificationHeader>
        {notifications.length > 0 ? (
          <NotificationList>
            {notifications.map((notification) => (
              <NotificationItem key={notification._id}>
                {notification.message}
              </NotificationItem>
            ))}
          </NotificationList>
        ) : (
          <EmptyMessage>No new notifications</EmptyMessage>
        )}
      </NotificationWrapper>
    </GlassEffect>
  </Container>
);
};

export default App;

// Styled Components
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, #0c0f1c, #111727, #171f38);
`;

const GlassEffect = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  border-radius: 20px;
  padding: 40px;
  width: 750px;
  height: 600px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  color: #0ef6cc;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #ddd;
  font-size: 1.2rem;
`;

const NotificationWrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  padding: 10px 20px;
`;

const NotificationHeader = styled.h2`
  font-size: 1.8rem;
  color: #ff4081;
  margin-bottom: 10px;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const NotificationItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
  font-size: 1.2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(14, 246, 204, 0.6);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const EmptyMessage = styled.p`
  color: #bbb;
  font-size: 1.3rem;
  margin-top: 20px;
`;

const LogoutButton = styled.button`
  background: #ff4081;
  color: #fff;
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #e91e63;
  }
`;