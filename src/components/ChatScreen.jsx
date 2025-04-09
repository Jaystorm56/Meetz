import { useRef, useState, useEffect } from 'react';
import { List, ListItem, IconButton, InputAdornment, Avatar, Box, Typography } from '@mui/material';
import { ArrowBack, Add, EmojiEmotions, Mic, Send, MoreVert } from '@mui/icons-material';
import io from 'socket.io-client';
import TextField from '@mui/material/TextField';

const API_URL = 'https://meetz-api.onrender.com';
const socket = io(API_URL, { transports: ['websocket'] });

const ChatScreen = ({ selectedUser, setSelectedUser, userProfile, chatMessages, setChatMessages, allChatMessages, setAllChatMessages, messageInput, setMessageInput, token, setLoading }) => {
  const chatContainerRef = useRef(null);
  const [chatId] = useState([userProfile._id, selectedUser._id].sort().join(':'));

  // Fetch initial messages
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/messages/${selectedUser._id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(messages => {
        setChatMessages(messages);
        setAllChatMessages(prev => ({ ...prev, [selectedUser._id]: messages }));
      })
      .catch(err => console.error('Error fetching messages:', err))
      .finally(() => setLoading(false));
  }, [selectedUser, token, setChatMessages, setAllChatMessages, setLoading]);

  // Set up WebSocket connection
  useEffect(() => {
    socket.emit('joinChat', chatId);

    socket.on('receiveMessage', (message) => {
      if (message.senderId === userProfile._id) return;

      setChatMessages(prev => [...prev, message]);
      setAllChatMessages(prev => ({
        ...prev,
        [selectedUser._id]: [...(prev[selectedUser._id] || []), message],
      }));
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [chatId, selectedUser, userProfile._id, setChatMessages, setAllChatMessages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const messageData = {
        chatId,
        senderId: userProfile._id,
        recipientId: selectedUser._id,
        text: messageInput,
        timestamp: new Date().toISOString(),
        type: 'text',
      };

      setChatMessages(prev => [...prev, messageData]);
      setAllChatMessages(prev => ({
        ...prev,
        [selectedUser._id]: [...(prev[selectedUser._id] || []), messageData],
      }));
      setMessageInput('');

      socket.emit('sendMessage', messageData);

      fetch(`${API_URL}/messages/${selectedUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: messageInput }),
      })
        .catch(err => console.error('Error sending message via HTTP:', err));
    }
  };

  // Group messages by date for the divider
  const groupedMessages = chatMessages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F5F5F5] m-0 p-0">
      {/* Header */}
      <div className="flex items-center justify-between p-7 bg-[#6D53F4] text-white">
        <div className="flex items-center">
          <IconButton onClick={() => setSelectedUser(null)} sx={{ color: '#FFFFFF', mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Avatar src={selectedUser.photos?.[0] || ''} alt={selectedUser.firstName} sx={{ width: 40, height: 40, mr: 2 }} />
          <div>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <Typography variant="caption">Online</Typography>
          </div>
        </div>
        <IconButton onClick={() => console.log('Chat options - Coming soon!')} sx={{ color: '#FFFFFF' }}>
          <MoreVert />
        </IconButton>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4"
        style={{
          backgroundColor: '#F5F5F5',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
          marginTop: '-20px',
        }}
      >
        {Object.keys(groupedMessages).map((date, index) => (
          <div key={date}>
            {/* Date Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: '#A0A0A0' }} />
              <Typography variant="caption" sx={{ mx: 2, color: '#A0A0A0', textTransform: 'uppercase' }}>
                {date === new Date().toLocaleDateString() ? 'TODAY' : date}
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: '#A0A0A0' }} />
            </Box>

            {/* Messages */}
            <List>
              {groupedMessages[date].map((msg, idx) => {
                const isCurrentUser = msg.senderId === userProfile._id;
                return (
                  <ListItem
                    key={idx}
                    sx={{
                      display: 'flex',
                      flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      mb: 2,
                      px: 0,
                    }}
                  >
                    <div className="flex flex-col">
                      {msg.type === 'image' ? (
                        <img
                          src={msg.text}
                          alt="Chat image"
                          style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '8px',
                            borderTopLeftRadius: isCurrentUser ? '12px' : '0px',
                            borderTopRightRadius: isCurrentUser ? '0px' : '12px',
                            borderBottomLeftRadius: isCurrentUser ? '12px' : '0px',
                            borderBottomRightRadius: isCurrentUser ? '0px' : '12px',
                          }}
                        />
                      ) : msg.type === 'voice' ? (
                        <div
                          style={{
                            backgroundColor: isCurrentUser ? '#6D53F4' : '#FFFFFF',
                            color: isCurrentUser ? '#FFFFFF' : '#000000',
                            borderTopLeftRadius: isCurrentUser ? '12px' : '0px',
                            borderTopRightRadius: isCurrentUser ? '0px' : '12px',
                            borderBottomLeftRadius: isCurrentUser ? '12px' : '0px',
                            borderBottomRightRadius: isCurrentUser ? '0px' : '12px',
                            width: '200px',
                            height: 'auto',
                            minHeight: '20px',
                            padding: '12px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: !isCurrentUser ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small" sx={{ color: isCurrentUser ? '#FFFFFF' : '#6D53F4', mr: 1 }}>
                              <Mic />
                            </IconButton>
                            <div style={{ flex: 1, height: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '5px' }} />
                          </div>
                          <Typography variant="caption" sx={{ alignSelf: 'flex-end', color: isCurrentUser ? '#FFFFFF' : '#A0A0A0' }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                          </Typography>
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: isCurrentUser ? '#6D53F4' : '#FFFFFF',
                            color: isCurrentUser ? '#FFFFFF' : '#000000',
                            borderTopLeftRadius: isCurrentUser ? '12px' : '0px',
                            borderTopRightRadius: isCurrentUser ? '0px' : '12px',
                            borderBottomLeftRadius: isCurrentUser ? '12px' : '0px',
                            borderBottomRightRadius: isCurrentUser ? '0px' : '12px',
                            minWidth: '200px',
                            minHeight: '20px',
                            padding: '8px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: !isCurrentUser ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                          <Typography variant="caption" sx={{ alignSelf: 'flex-end', color: isCurrentUser ? '#FFFFFF' : '#A0A0A0' }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#F5F5F5]">
        <TextField
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#E0E0E0' },
              '&:hover fieldset': { borderColor: '#6D53F4' },
              '&.Mui-focused fieldset': { borderColor: '#6D53F4' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => console.log('Gallery - Coming soon!')} sx={{ color: '#6D53F4' }}>
                  <Add />
                </IconButton>
                <IconButton onClick={() => console.log('Emoji - Coming soon!')} sx={{ color: '#6D53F4' }}>
                  <EmojiEmotions />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => console.log('Voice - Coming soon!')} sx={{ color: '#6D53F4' }}>
                  <Mic />
                </IconButton>
                <IconButton onClick={handleSendMessage} sx={{ color: '#6D53F4' }}>
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default ChatScreen;