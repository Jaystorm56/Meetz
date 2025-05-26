import { useEffect, useRef, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { ArrowBack, Search } from '@mui/icons-material';
import { IoFilter } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import meetzLogoBg from './assets/images/meetzlogbg.png';
import './index.css';

// Import Components
import Loader from './components/Loader';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfileSetup from './components/ProfileSetup';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Matches from './components/Matches';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import MatchedModal from './components/MatchedModal';
import { NotificationProvider } from './components/NotificationProvider';
import FilterModal from './components/FilterModal';

const API_URL = 'https://meetz-api.onrender.com';

function App() {
  const fileInputRefs = useRef([]);
  const [activeTab, setActiveTab] = useState('Welcome');
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [allChatMessages, setAllChatMessages] = useState({});
  const [userProfile, setUserProfile] = useState({ firstName: '', lastName: '', age: 0, bio: '', gender: '', interests: [], photos: [], dob: null });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '', firstName: '', lastName: '', termsAgreed: false });
  const [signupStep, setSignupStep] = useState(0);
  const [forgotData, setForgotData] = useState({ username: '' });
  const [resetData, setResetData] = useState({ token: '', newPassword: '' });
  const [authError, setAuthError] = useState('');
  const [resetToken, setResetToken] = useState(new URLSearchParams(window.location.search).get('token') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMatchedModal, setShowMatchedModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    location: 'New York, USA',
    interestedIn: 'Women',
    sortBy: 'Online',
    distance: [0, 20],
    age: [18, 48],
  });


  // Function to refetch users
  const refetchUsers = () => {
    if (signupStep === 0) {
      setLoading(true);
      fetch(`${API_URL}/users`, { 
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setUsers(data);
          setCurrentIndex(data.length - 1);
        })
        .catch(err => console.error('Error refetching users:', err))
        .finally(() => setLoading(false));
    }
  };

  // Function to refetch matches
  const refetchMatches = () => {
    if (signupStep === 0) {
      setLoading(true);
      fetch(`${API_URL}/matches`, { 
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => setMatches(data))
        .catch(err => console.error('Error refetching matches:', err))
        .finally(() => setLoading(false));
    }
  };

  // Fetch profile on app load
  useEffect(() => {
    if (signupStep === 0) {
      setLoading(true);
      fetch(`${API_URL}/profile`, { 
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => setUserProfile(data))
        .catch(err => console.error('Error fetching profile:', err))
        .finally(() => setLoading(false));
    }
  }, [signupStep]);

  // Fetch users on app load
  useEffect(() => {
    refetchUsers();
  }, [signupStep]);

  // Fetch matches when on Matches or Chat tab
  useEffect(() => {
    if (signupStep === 0 && (activeTab === 'Matches' || (activeTab === 'Chat' && !selectedUser))) {
      refetchMatches();
    }
  }, [activeTab, selectedUser, signupStep]);

  // Fetch all chat messages on app load to populate allChatMessages
  useEffect(() => {
    if (signupStep === 0) {
      setLoading(true);
      fetch(`${API_URL}/messages`, { 
        credentials: 'include',
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
          }
          return res.json();
        })
        .then(data => {
          console.log('Fetched chat messages:', data);
          setAllChatMessages(data);
        })
        .catch(err => {
          console.error('Error fetching all chat messages:', err);
          setAllChatMessages({});
        })
        .finally(() => setLoading(false));
    }
  }, [signupStep]);

  const capitalizeName = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleProfileChange = (field, value) => {
    if (field === 'dob') {
      const age = calculateAge(value);
      setUserProfile(prev => ({ ...prev, [field]: value, age }));
    } else {
      setUserProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleInterestToggle = (interest) => {
    const currentInterests = userProfile.interests || [];
    if (currentInterests.includes(interest)) {
      setUserProfile(prev => ({ ...prev, interests: currentInterests.filter(i => i !== interest) }));
    } else if (currentInterests.length < 5) {
      setUserProfile(prev => ({ ...prev, interests: [...currentInterests, interest] }));
    }
  };

  const handlePhotoUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'meetz_preset');
      fetch('https://api.cloudinary.com/v1_1/dnlgzyxbo/image/upload', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.secure_url) {
            const newPhotos = [...userProfile.photos];
            newPhotos[index] = data.secure_url;
            setUserProfile(prev => ({ ...prev, photos: newPhotos }));
          }
        })
        .catch(err => console.error('Error uploading photo:', err))
        .finally(() => setLoading(false));
    }
  };

  const handleBackClick = () => {
    if (signupStep > 0) setSignupStep(prev => prev - 1);
    else if (selectedUser) setSelectedUser(null);
    else if (isEditingProfile) {
      setIsEditingProfile(false);
      setActiveTab('Profile');
    } else if (showMatchedModal) {
      setShowMatchedModal(false);
    } else setActiveTab('Home');
  };

  const handleMatch = (matchedUser) => {
    setMatchedUser(matchedUser);
    setShowMatchedModal(true);
    // Update matches state immediately
    setMatches(prev => [...prev, matchedUser]);
    // Refetch matches to ensure the Matches and Chat tabs are updated
    refetchMatches();
  };

  const handleOpenFilter = () => setShowFilterModal(true);
  const handleCloseFilter = () => setShowFilterModal(false);
  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleFilterReset = () => setFilters({
    location: 'New York, USA',
    interestedIn: 'Women',
    sortBy: 'Online',
    distance: [0, 20],
    age: [18, 48],
  });
  const handleFilterApply = () => setShowFilterModal(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // Optionally handle error
    }
    setActiveTab('Welcome');
    setUserProfile({ firstName: '', lastName: '', age: 0, bio: '', gender: '', interests: [], photos: [], dob: null });
    setIsEditingProfile(false);
    setLoading(false);
  };

  if (signupStep > 0) {
    return (
      <ProfileSetup
        signupStep={signupStep}
        setSignupStep={setSignupStep}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        calculateAge={calculateAge}
        handleProfileChange={handleProfileChange}
        handleInterestToggle={handleInterestToggle}
        handlePhotoUpload={handlePhotoUpload}
        fileInputRefs={fileInputRefs}
        setActiveTab={setActiveTab}
        setLoading={setLoading}
        refetchUsers={refetchUsers}
      />
    );
  }

  // Show signup/login/welcome flow only for those tabs
  if (["Welcome", "Login", "Signup", "Forgot"].includes(activeTab)) {
    return (
      <div className="min-h-screen bg-background flex flex-col text-secondary p-4">
        {activeTab === 'Welcome' && <Welcome setActiveTab={setActiveTab} />}
        {activeTab === 'Login' && (
          <Login
            loginData={loginData}
            setLoginData={setLoginData}
            setActiveTab={setActiveTab}
            setAuthError={setAuthError}
            setLoading={setLoading}
          />
        )}
        {activeTab === 'Signup' && (
          <Signup
            signupData={signupData}
            setSignupData={setSignupData}
            setSignupStep={setSignupStep}
            setActiveTab={setActiveTab}
            setLoading={setLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            capitalizeName={capitalizeName}
            setAuthError={setAuthError}
          />
        )}
        {activeTab === 'Forgot' && (
          <ForgotPassword
            forgotData={forgotData}
            setForgotData={setForgotData}
            resetData={resetData}
            setResetData={setResetData}
            resetToken={resetToken}
            setActiveTab={setActiveTab}
            setAuthError={setAuthError}
            setLoading={setLoading}
          />
        )}
        {authError && <Typography color="error" className="text-center mt-2">{authError}</Typography>}
        {loading && <Loader />}
      </div>
    );
  }

  // Main app UI (Home, Matches, Chat, Profile, etc.)
  return (
    <NotificationProvider userProfile={userProfile} token={null}>
      <div className="min-h-screen bg-background flex flex-col text-secondary">
        {/* Hide the AppBar when on the Chat tab (both ChatScreen and ChatList) or Matches tab */}
        {activeTab !== 'Chat' && activeTab !== 'Matches' && (
          <AppBar position="static" sx={{ backgroundColor: '#6D53F4' }}>
            <Toolbar>
              {activeTab !== 'Home' && (
                <IconButton edge="start" color="inherit" onClick={handleBackClick} sx={{ color: '#FFFFFF' }}>
                  <ArrowBack />
                </IconButton>
              )}
              {activeTab === 'Home' ? (
                <img src={meetzLogoBg} alt="MEETZ Logo" className="nav-item h-[77px]" />
              ) : (
                <h2 className="text-xl font-bold text-white flex-grow text-center">{isEditingProfile ? 'Edit Profile' : activeTab}</h2>
              )}
              {activeTab === 'Home' && <div className="flex-grow" />}
              <IconButton edge="end" color="inherit" onClick={activeTab === 'Home' ? handleOpenFilter : () => console.log('Search - Coming soon!')} sx={{ color: '#FFFFFF', fontSize: '35px' }}>
                {activeTab === 'Home' ? <LuSettings2  /> : <Search />}
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Conditionally apply padding and margin based on whether ChatScreen or ChatList is active */}
        <div
          className={`flex-grow flex justify-center ${
            activeTab === 'Chat' && selectedUser
              ? 'p-0 m-0'
              : activeTab === 'Chat' || activeTab === 'Matches'
              ? 'p-0 mb-16'
              : 'p-4 mb-16'
          }`}
        >
          {activeTab === 'Home' && (
            <Home
              users={users}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              token={null}
              setActiveTab={setActiveTab}
              setLoading={setLoading}
              onMatch={handleMatch}
              refetchUsers={refetchUsers}
            />
          )}
          {activeTab === 'Matches' && (
            <Matches
              matches={matches}
              setActiveTab={setActiveTab}
              setSelectedUser={setSelectedUser}
            />
          )}
          {activeTab === 'Chat' && (
            <Chat
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              allChatMessages={allChatMessages}
              setAllChatMessages={setAllChatMessages}
              userProfile={userProfile}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              token={null}
              setLoading={setLoading}
            />
          )}
          {activeTab === 'Profile' && (
            <Profile
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              token={null}
              setToken={() => {}}
              setActiveTab={setActiveTab}
              setLoading={setLoading}
              handlePhotoUpload={handlePhotoUpload}
              capitalizeName={capitalizeName}
            />
          )}
        </div>

        <MatchedModal
          open={showMatchedModal}
          onClose={() => setShowMatchedModal(false)}
          currentUser={userProfile}
          matchedUser={matchedUser}
          setActiveTab={setActiveTab}
          setSelectedUser={setSelectedUser}
        />

        {/* Filter Modal */}
        <FilterModal
          open={showFilterModal}
          onClose={handleCloseFilter}
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
          onApply={handleFilterApply}
        />

        {!(activeTab === 'Chat' && selectedUser) && (
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {loading && <Loader />}
      </div>
    </NotificationProvider>
  );
}

export default App;