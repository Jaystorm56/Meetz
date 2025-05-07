import { IconButton } from '@mui/material';
import { Home, Person } from '@mui/icons-material';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LuHeartHandshake } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { GoHome } from "react-icons/go";

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center">
      <div className="flex justify-between p-3 bg-black rounded-full shadow-lg w-[95%]">
        <IconButton onClick={() => setActiveTab('Home')} sx={{ color: activeTab === 'Home' ? '#FFFFFF' : 'gainsboro', backgroundColor: activeTab === 'Home' ? '#6D53F4' : 'transparent', borderRadius: '50%', '&:hover': { backgroundColor: activeTab === 'Home' ? '#5C45D3' : '#E8E9F0' } }}>
          <GoHome fontSize="35px" />
        </IconButton>
        <IconButton onClick={() => setActiveTab('Matches')} sx={{ color: activeTab === 'Matches' ? '#FFFFFF' : 'gainsboro', backgroundColor: activeTab === 'Matches' ? '#6D53F4' : 'transparent', borderRadius: '50%', '&:hover': { backgroundColor: activeTab === 'Matches' ? '#5C45D3' : '#E8E9F0' } }}>
          <LuHeartHandshake fontSize="35px" />
        </IconButton>
        <IconButton onClick={() => setActiveTab('Chat')} sx={{ color: activeTab === 'Chat' ? '#FFFFFF' : 'gainsboro', backgroundColor: activeTab === 'Chat' ? '#6D53F4' : 'transparent', borderRadius: '50%', '&:hover': { backgroundColor: activeTab === 'Chat' ? '#5C45D3' : '#E8E9F0' } }}>
          <IoChatboxEllipsesOutline  fontSize="35px" />
        </IconButton>
        <IconButton onClick={() => setActiveTab('Profile')} sx={{ color: activeTab === 'Profile' ? '#FFFFFF' : 'gainsboro', backgroundColor: activeTab === 'Profile' ? '#6D53F4' : 'transparent', borderRadius: '50%', '&:hover': { backgroundColor: activeTab === 'Profile' ? '#5C45D3' : '#E8E9F0' } }}>
          <GoPerson fontSize="35px" />
        </IconButton>
      </div>
    </div>
  );
};

export default Navbar;