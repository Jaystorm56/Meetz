import ChatList from './ChatList';
import ChatScreen from './ChatScreen';

const Chat = ({ selectedUser, setSelectedUser, chatMessages, setChatMessages, allChatMessages, setAllChatMessages, userProfile, messageInput, setMessageInput, token, setLoading, setActiveTab }) => {
  if (!selectedUser) {
    return (
      <ChatList
        allChatMessages={allChatMessages}
        token={token}
        setSelectedUser={setSelectedUser}
        setActiveTab={setActiveTab} // Pass setActiveTab to ChatList
      />
    );
  }

  return (
    <ChatScreen
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
      userProfile={userProfile}
      chatMessages={chatMessages}
      setChatMessages={setChatMessages}
      allChatMessages={allChatMessages}
      setAllChatMessages={setAllChatMessages}
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      token={token}
      setLoading={setLoading}
    />
  );
};

export default Chat;