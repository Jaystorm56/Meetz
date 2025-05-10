import { useRef, useEffect } from 'react';
import { Card, CardContent, List, ListItem, ListItemText, TextField, IconButton, Button, Box } from '@mui/material';
import { Person, Edit, ChevronRight, Policy } from '@mui/icons-material';
import { GoPerson } from "react-icons/go";
import { GrSettingsOption } from "react-icons/gr";
import { IoExit } from "react-icons/io5";

const API_URL = 'https://meetz-api.onrender.com';

const Profile = ({ userProfile, setUserProfile, isEditingProfile, setIsEditingProfile, token, setToken, setActiveTab, setLoading, handlePhotoUpload, capitalizeName }) => {
  const fileInputRefs = useRef([]);
  const profileContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  const handleSaveProfile = () => {
    setLoading(true);
    fetch(`${API_URL}/profile`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
      body: JSON.stringify(userProfile) 
    })
      .then(() => {
        setIsEditingProfile(false);
        setActiveTab('Profile');
      })
      .catch(err => console.error('Error saving profile:', err))
      .finally(() => setLoading(false));
  };

  const handleProfileChange = (field, value) => {
    setUserProfile(prev => ({ ...prev, [field]: field === 'firstName' || field === 'lastName' ? capitalizeName(value) : value }));
  };

  const handleLogout = () => {
    setToken(null);
    setActiveTab('Welcome');
  };

  if (!isEditingProfile) {
    return (
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col h-full overflow-y-auto px-0">
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="relative">
            {userProfile.photos[0] ? (
              <img 
                src={userProfile.photos[0]} 
                alt={`${userProfile.firstName} ${userProfile.lastName}`} 
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover" 
              />
            ) : (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-full">
                  <Person sx={{ fontSize: { xs: 80, sm: 100 }, color: '#FFFFFF' }} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#6D53F4] to-[#A78BFA] opacity-50 rounded-full"></div>
              </div>
            )}
            <IconButton 
              onClick={() => fileInputRefs.current[0].click()} 
              sx={{ 
                position: 'absolute', 
                bottom: { xs: 10, sm: 15 }, 
                right: { xs: 5, sm: 7 }, 
                backgroundColor: '#6D53F4', 
                color: '#FFFFFF', 
                padding: { xs: '4px', sm: '6px' }, 
                '&:hover': { backgroundColor: '#5C45D3' } 
              }}
            >
              <Edit sx={{ fontSize: { xs: 20, sm: 25 } }} />
            </IconButton>
            <input 
              type="file" 
              accept="image/*" 
              ref={el => (fileInputRefs.current[0] = el)} 
              onChange={(e) => handlePhotoUpload(0, e)} 
              style={{ display: 'none' }} 
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-2">
            {userProfile.firstName} {userProfile.lastName}
          </h2>
        </div>
        <div className="overflow-y-auto flex flex-col" style={{ height: '45vh', width: '100%' }}>
          <List sx={{ width: '100%', padding: 0}}>
            <ListItem 
              button 
              onClick={() => setIsEditingProfile(true)} 
              sx={{ borderBottom: '1px solid #E0E0E0', width:'100%', marginTop: '10px',px:'0px', py: { xs: 1.5, sm: 2 }, display: 'flex', alignItems: 'center' , justifyContent: 'space-between' }}
            >
              <GoPerson size={32} style={{ color: '#6D53F4', marginRight: 12 }} />
              <ListItemText 
                primary="Edit Profile" 
                sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' }, color: '#242424' }} 
              />
              <ChevronRight sx={{ color: '#6D53F4', fontSize: { xs: 30, sm: 35 } }} />
            </ListItem>
            <ListItem 
              button 
              onClick={() => console.log('Settings - Coming soon!')} 
              sx={{ borderBottom: '1px solid #E0E0E0', marginTop: '10px',px:'0px', py: { xs: 1.5, sm: 2 } }}
            >
              <GrSettingsOption size={32} style={{ color: '#6D53F4', marginRight: 12 }} />
              <ListItemText 
                primary="Settings" 
                sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' }, color: '#242424' }} 
              />
              <ChevronRight sx={{ color: '#6D53F4', fontSize: { xs: 30, sm: 35 } }} />
            </ListItem>
            <ListItem 
              button 
              onClick={() => console.log('Privacy Policy - Coming soon!')} 
              sx={{ borderBottom: '1px solid #E0E0E0', marginTop: '10px', px:'0px', py: { xs: 1.5, sm: 2 } }}
            >
              <Policy sx={{ color: '#6D53F4', mr: 2, fontSize: { xs: 30, sm: 35 } }} />
              <ListItemText 
                primary="Privacy Policy" 
                sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' }, color: '#242424' }} 
              />
              <ChevronRight sx={{ color: '#6D53F4', fontSize: { xs: 30, sm: 35 } }} />
            </ListItem>
            <ListItem 
              button 
              onClick={handleLogout} 
              sx={{ borderBottom: '1px solid #E0E0E0', marginTop: '10px', px:'0px', py: { xs: 1.5, sm: 2 } }}
            >
              <IoExit size={32} style={{ color: '#6D53F4', marginRight: 12 }} />
              <ListItemText 
                primary="Logout" 
                sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' }, color: '#242424' }} 
              />
              <ChevronRight sx={{ color: '#6D53F4', fontSize: { xs: 30, sm: 35 } }} />
            </ListItem>
          </List>
        </div>
      </div>
    );
  }

  return (
    <div ref={profileContainerRef} className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col h-full overflow-y-auto px-4">
      <Card className="shadow-lg">
        <div className="relative">
          {userProfile.photos[0] ? (
            <img 
              src={userProfile.photos[0]} 
              alt={`${userProfile.firstName} ${userProfile.lastName}`} 
              className="h-64 sm:h-80 md:h-96 w-full rounded-lg object-cover mt-2" 
            />
          ) : (
            <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg mt-2">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                <Person sx={{ fontSize: { xs: 100, sm: 120 }, color: '#FFFFFF' }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#6D53F4] to-[#A78BFA] opacity-50 rounded-lg"></div>
            </div>
          )}
        </div>
        <CardContent>
          <TextField 
            label="First Name" 
            value={userProfile.firstName} 
            onChange={(e) => handleProfileChange('firstName', e.target.value)} 
            fullWidth 
            sx={{ mb: 2, mt: 2 }} 
          />
          <TextField 
            label="Last Name" 
            value={userProfile.lastName} 
            onChange={(e) => handleProfileChange('lastName', e.target.value)} 
            fullWidth 
            sx={{ mb: 2 }} 
          />
          <TextField 
            label="Age" 
            value={userProfile.age} 
            onChange={(e) => handleProfileChange('age', e.target.value)} 
            type="number" 
            fullWidth 
            sx={{ mb: 2 }} 
          />
          <TextField 
            label="Bio" 
            value={userProfile.bio} 
            onChange={(e) => handleProfileChange('bio', e.target.value)} 
            multiline 
            rows={3} 
            fullWidth 
            sx={{ mb: 2 }} 
          />
          <Button 
            onClick={handleSaveProfile} 
            sx={{ 
              backgroundColor: '#6D53F4', 
              color: '#FFFFFF', 
              '&:hover': { backgroundColor: '#5C45D3' },
              width: { xs: '100%', sm: 'auto' },
              px: 3,
              py: 1
            }}
          >
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;