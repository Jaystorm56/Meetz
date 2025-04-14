import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Button, TextField, Typography, Box, Grid, Modal, LinearProgress } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowBack, Add, Male, Female, VideogameAsset, Book, Camera, Pets, SportsSoccer, Nature, Checkroom, MusicNote, Lightbulb, AttachMoney, Flight, DirectionsCar } from '@mui/icons-material';

const API_URL = 'https://meetz-api.onrender.com';

const interestsList = [
  { name: 'Gaming', icon: <VideogameAsset /> },
  { name: 'Books', icon: <Book /> },
  { name: 'Photography', icon: <Camera /> },
  { name: 'Animals', icon: <Pets /> },
  { name: 'Football', icon: <SportsSoccer /> },
  { name: 'Nature', icon: <Nature /> },
  { name: 'Fashion', icon: <Checkroom /> },
  { name: 'Music', icon: <MusicNote /> },
  { name: 'Tech', icon: <Lightbulb /> },
  { name: 'Finance', icon: <AttachMoney /> },
  { name: 'Travel', icon: <Flight /> },
  { name: 'Cars', icon: <DirectionsCar /> },
];

const ProfileSetup = ({ signupStep, setSignupStep, userProfile, setUserProfile, token, setActiveTab, setLoading, calculateAge, handleProfileChange, handleInterestToggle, handlePhotoUpload, fileInputRefs }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleProfileNext = () => {
    if (signupStep === 1 && !userProfile.gender) {
      setModalMessage('Please select your gender before proceeding.');
      setModalOpen(true);
      return;
    }
    if (signupStep === 2 && !userProfile.dob) {
      setModalMessage('Please select your date of birth before proceeding.');
      setModalOpen(true);
      return;
    }
    if (signupStep === 2 && calculateAge(userProfile.dob) < 18) {
      setModalMessage('You must be 18 or older to register.');
      setModalOpen(true);
      return;
    }
    if (signupStep === 5) {
      setLoading(true);
      fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(userProfile),
      })
        .then(() => {
          setActiveTab('Home');
          setSignupStep(0);
        })
        .catch(err => console.error('Error saving profile:', err))
        .finally(() => setLoading(false));
    } else {
      setSignupStep(prev => prev + 1);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between">
        <Box>
          <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', marginBottom:'20px', border:'4px solid' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                edge="start"
                onClick={() => setSignupStep(prev => prev - 1)}
                sx={{
                  backgroundColor: '#6D53F4',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  '&:hover': { backgroundColor: '#5C45D3' },
                }}
              >
                <ArrowBack sx={{ fontSize: '24px' }} />
              </IconButton>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(signupStep / 5) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 10,
                    backgroundColor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#6D53F4' },
                    width:'200px'
            
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#6D53F4',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {signupStep}/5
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
        <Box className="flex-grow flex flex-col justify-evenly text-center h-[450px]">
          {signupStep === 1 && (
            <>
              <Typography variant="h2" className="text-primary" sx={{ fontSize: '30px', fontWeight: 550, border:'3px solid' }}>Tell Us About Yourself</Typography>
              <Typography variant="body2" className="text-secondary" sx={{ fontSize: 16, fontWeight: 500, marginBottom: 4, marginTop:-3 }}>To give you a better experience, we need to know your gender</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Button
                  onClick={() => handleProfileChange('gender', 'male')}
                  sx={{
                    backgroundColor: userProfile.gender === 'male' ? '#6D53F4' : '#F4F5F9',
                    color: userProfile.gender === 'male' ? '#FFFFFF' : '#6D53F4',
                    p: 3,
                    borderRadius: '50%',
                    width: 150,
                    height: 150,
                    '&:hover': { backgroundColor: userProfile.gender === 'male' ? '#5C45D3' : '#E8E9F0' }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Male sx={{ fontSize: 50 }} />
                    <Typography>Male</Typography>
                  </Box>
                </Button>
                <Button
                  onClick={() => handleProfileChange('gender', 'female')}
                  sx={{
                    backgroundColor: userProfile.gender === 'female' ? '#6D53F4' : '#F4F5F9',
                    color: userProfile.gender === 'female' ? '#FFFFFF' : '#6D53F4',
                    p: 3,
                    borderRadius: '50%',
                    width: 150,
                    height: 150,
                    '&:hover': { backgroundColor: userProfile.gender === 'female' ? '#5C45D3' : '#E8E9F0' }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Female sx={{ fontSize: 50 }} />
                    <Typography>Female</Typography>
                  </Box>
                </Button>
              </Box>
              <Button onClick={handleProfileNext} sx={{ mt: 4, backgroundColor: '#6D53F4', fontSize: '0.9rem', fontWeight: 400, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, px: 4, py: 1.5, borderRadius: 50 }}>Next</Button>
            </>
          )}
          {signupStep === 2 && (
            <>
              <Typography variant="h5" className="text-primary mb-4" sx={{ fontSize: '30px', fontWeight: 700 }}>How Old Are You?</Typography>
              <Typography variant="body2" className="text-secondary mb-6" sx={{ fontSize: '16px', fontWeight: 500 }}>Select your date of birth</Typography>
              <DatePicker
                label="Date of Birth"
                value={userProfile.dob}
                onChange={(newValue) => handleProfileChange('dob', newValue)}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 6, maxWidth: 200, mx: 'auto', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />}
                maxDate={new Date()}
              />
              <Button onClick={handleProfileNext} sx={{ backgroundColor: '#6D53F4', fontSize: '0.9rem', fontWeight: 400, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, px: 4, py: 1.5, borderRadius: 50 }}>Next</Button>
            </>
          )}
          {signupStep === 3 && (
            <>
              <Typography variant="h5" className="text-primary mb-2" sx={{ fontSize: '30px', fontWeight: 700, marginTop: 16 }}>Select Up to 5 Interests</Typography>
              <Typography variant="body2" className="text-secondary" sx={{ fontSize: '16px', fontWeight: 500, marginTop: 1, marginBottom: 4 }}>Discover meaningful connections by selecting your interests</Typography>
              <Grid container spacing={2} sx={{ mb: 6, justifyContent: 'center' }}>
                {interestsList.map(interest => (
                  <Grid item xs={4} key={interest.name}>
                    <Button
                      onClick={() => handleInterestToggle(interest.name)}
                      sx={{
                        backgroundColor: userProfile.interests.includes(interest.name) ? '#6D53F4' : '#F4F5F9',
                        color: userProfile.interests.includes(interest.name) ? '#FFFFFF' : '#6D53F4',
                        p: 2,
                        borderRadius: 4,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {interest.icon}
                      <Typography>{interest.name}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Button onClick={handleProfileNext} sx={{ backgroundColor: '#6D53F4', fontSize: '0.9rem', fontWeight: 400, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, px: 4, py: 1.5, borderRadius: 50 }}>Next</Button>
            </>
          )}
          {signupStep === 4 && (
            <>
              <Typography variant="h5" className="text-primary mb-4" sx={{ fontSize: '30px', fontWeight: 700 }}>Describe Yourself</Typography>
              <Typography variant="body2" className="text-secondary" sx={{ fontSize: '16px', fontWeight: 500, marginTop: 1, marginBottom: 4 }}>Tell us a bit about yourself</Typography>
              <TextField
                label="Bio"
                value={userProfile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 6, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 20, backgroundColor: '#f4f5f9' } }}
              />
              <Button onClick={handleProfileNext} sx={{ backgroundColor: '#6D53F4', fontSize: '0.9rem', fontWeight: 400, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, px: 4, py: 1.5, borderRadius: 50 }}>Next</Button>
            </>
          )}
          {signupStep === 5 && (
            <>
              <Typography variant="h5" className="text-primary mb-4" sx={{ fontSize: '34px', fontWeight: 700 }}>Upload Your Photos</Typography>
              <Typography variant="body2" className="text-secondary mb-6" sx={{ fontSize: '20px', fontWeight: 500, marginTop: 1, marginBottom: 4 }}>To boost your daily match potential, upload your photos</Typography>
              <Grid container spacing={2} sx={{ mb: 6 }}>
                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: '#F4F5F9', borderRadius: 2, height: '260px', width: '230px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {userProfile.photos[0] ? (
                      <>
                        <img src={userProfile.photos[0]} alt="Main" className="w-full h-full object-cover rounded-lg" />
                        <Button
                          onClick={() => fileInputRefs.current[0].click()}
                          sx={{ position: 'absolute', bottom: 10, backgroundColor: '#6D53F4', color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' } }}
                        >
                          Change Photo
                        </Button>
                      </>
                    ) : (
                      <IconButton onClick={() => fileInputRefs.current[0].click()} sx={{ color: '#6D53F4' }}>
                        <Add sx={{ fontSize: 60 }} />
                      </IconButton>
                    )}
                    <input type="file" accept="image/*" ref={el => (fileInputRefs.current[0] = el)} onChange={(e) => handlePhotoUpload(0, e)} style={{ display: 'none' }} />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: '#F4F5F9', borderRadius: 2, height: '127px', width: '111px', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {userProfile.photos[1] ? (
                      <img src={userProfile.photos[1]} alt="Photo 2" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <IconButton onClick={() => fileInputRefs.current[1].click()} sx={{ color: '#6D53F4' }}>
                        <Add sx={{ fontSize: 40 }} />
                      </IconButton>
                    )}
                    <input type="file" accept="image/*" ref={el => (fileInputRefs.current[1] = el)} onChange={(e) => handlePhotoUpload(1, e)} style={{ display: 'none' }} />
                  </Box>
                  <Box sx={{ backgroundColor: '#F4F5F9', borderRadius: 2, height: '127px', width: '111px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {userProfile.photos[2] ? (
                      <img src={userProfile.photos[2]} alt="Photo 3" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <IconButton onClick={() => fileInputRefs.current[2].click()} sx={{ color: '#6D53F4' }}>
                        <Add sx={{ fontSize: 40 }} />
                      </IconButton>
                    )}
                    <input type="file" accept="image/*" ref={el => (fileInputRefs.current[2] = el)} onChange={(e) => handlePhotoUpload(2, e)} style={{ display: 'none' }} />
                  </Box>
                </Grid>
              </Grid>
              <Button onClick={handleProfileNext} sx={{ backgroundColor: '#6D53F4', fontSize: '0.9rem', fontWeight: 400, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, px: 4, py: 1.5, borderRadius: 50 }}>Finish</Button>
            </>
          )}
        </Box>
        <Box sx={{ height: '10vh' }} />
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#FFFFFF', p: 4, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#242424' }}>{modalMessage}</Typography>
            <Button onClick={() => setModalOpen(false)} sx={{ backgroundColor: '#6D53F4', color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, borderRadius: 50 }}>OK</Button>
          </Box>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};

export default ProfileSetup;