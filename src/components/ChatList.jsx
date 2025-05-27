import { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, IconButton, Badge } from '@mui/material';
import { ArrowBack, Search } from '@mui/icons-material';

const API_URL = 'https://meetz-api.onrender.com';

const ChatList = ({ allChatMessages, token, setSelectedUser, setActiveTab }) => {
  const [chattedUsers, setChattedUsers] = useState([]);

  // Fetch user details for chatted users when allChatMessages changes
  useEffect(() => {
    const chattedUserIds = Object.keys(allChatMessages).filter(id => allChatMessages[id].length > 0);
    if (chattedUserIds.length > 0) {
      Promise.all(
        chattedUserIds.map(id =>
          fetch(`${API_URL}/users/${id}`, {
            credentials: 'include',
          })
            .then(res => res.json())
            .catch(err => {
              console.error(`Error fetching user ${id}:`, err);
              return null;
            })
        )
      )
        .then(users => {
          const validUsers = users.filter(user => user !== null);
          setChattedUsers(validUsers);
        })
        .catch(err => console.error('Error fetching chatted users:', err));
    } else {
      setChattedUsers([]);
    }
  }, [allChatMessages, token]);

  // Get the last message for a user
  const getLastMessage = (userId) => {
    const messages = allChatMessages[userId];
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      return lastMessage.text;
    }
    return "Click to continue chatting!";
  };

  // Get the timestamp of the last message
  const getLastMessageTime = (userId) => {
    const messages = allChatMessages[userId];
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      return new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();
    }
    return "";
  };

  return (
    <div className="w-screen flex flex-col h-screen bg-[#F5F5F5] m-0 p-0">
      {/* Header */}
      <div className="flex items-center justify-between p-7 bg-[#6D53F4] text-white">
        <IconButton onClick={() => setActiveTab('Home')} sx={{ color: '#FFFFFF' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>
          Chat
        </Typography>
        <IconButton onClick={() => console.log('Search - Coming soon!')} sx={{ color: '#FFFFFF' }}>
          <Search />
        </IconButton>
      </div>

      {/* Chat List */}
      <div
        className="flex-grow overflow-y-auto p-4 pb-16"
        style={{
          backgroundColor: '#f4f5f9',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
          marginTop: '-20px',
        }}
      >
        {chattedUsers.length > 0 ? (
          <List>
            {chattedUsers.map((user) => (
              <ListItem
                key={user._id}
                button
                onClick={() => setSelectedUser(user)}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  mb: 3,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                    }
                  >
                    <Avatar
                      src={user.photos?.[0] || ''}
                      alt={user.firstName}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.firstName} ${user.lastName}`}
                  secondary={getLastMessage(user._id)}
                  primaryTypographyProps={{ fontWeight: 'bold', color: '#242424' }}
                  secondaryTypographyProps={{
                    color: '#797979',
                    style: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    },
                  }}
                  sx={{ flex: 1, marginRight: 2 }}
                />
                <Typography variant="caption" sx={{ color: '#797979', flexShrink: 0 }}>
                  {getLastMessageTime(user._id)}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography className="text-secondary text-center mt-4">
            No chats yet. Send a message to start!
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ChatList;
