import { useState, useEffect } from 'react';
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [signupStep]);

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
      <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', display: 'flex', flexDirection: 'column', px: { xs: 2, sm: 3 } }}>
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none',  borderRadius: 2 }}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setSignupStep(prev => prev - 1)}
              sx={{
                backgroundColor: '#6D53F4',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                '&:hover': { backgroundColor: '#5C45D3' },
              }}
            >
              <ArrowBack sx={{ fontSize: { xs: 20, sm: 24 } }} />
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
                  width: { xs: '60%', sm: '40%', md: '30%' },
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: '14px', sm: '15px' },
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
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', textAlign: 'center' }}>
          {signupStep === 1 && (
            <>
              <Box sx={{ mb: 4, mt: 2 }}>
                <Typography variant="h2" sx={{ fontSize: { xs: '24px', sm: '30px' }, fontWeight: 550, color: '#6D53F4' }}>
                  Tell Us About Yourself
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500, color: '#666', mt: 1 }}>
                  To give you a better experience, we need to know your gender
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: '100%' }}>
                <Button
                  onClick={() => handleProfileChange('gender', 'male')}
                  sx={{
                    backgroundColor: userProfile.gender === 'male' ? '#6D53F4' : '#F4F5F9',
                    color: userProfile.gender === 'male' ? '#FFFFFF' : '#6D53F4',
                    p: 3,
                    mt: 2,
                    borderRadius: '50%',
                    width: { xs: '40vw', sm: '150px' },
                    height: { xs: '40vw', sm: '150px' },
                    maxWidth: '150px',
                    maxHeight: '150px',
                    '&:hover': { backgroundColor: userProfile.gender === 'male' ? '#5C45D3' : '#E8E9F0' },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Male sx={{ fontSize: { xs: 40, sm: 50 } }} />
                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }}>Male</Typography>
                  </Box>
                </Button>
                <Button
                  onClick={() => handleProfileChange('gender', 'female')}
                  sx={{
                    backgroundColor: userProfile.gender === 'female' ? '#6D53F4' : '#F4F5F9',
                    color: userProfile.gender === 'female' ? '#FFFFFF' : '#6D53F4',
                    p: 3,
                    borderRadius: '50%',
                    width: { xs: '40vw', sm: '150px' },
                    height: { xs: '40vw', sm: '150px' },
                    maxWidth: '150px',
                    maxHeight: '150px',
                    '&:hover': { backgroundColor: userProfile.gender === 'female' ? '#5C45D3' : '#E8E9F0' },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Female sx={{ fontSize: { xs: 40, sm: 50 } }} />
                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }}>Female</Typography>
                  </Box>
                </Button>
              </Box>
              <Button
                onClick={handleProfileNext}
                sx={{
                  mt: 6,
                  backgroundColor: '#6D53F4',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontWeight: 400,
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#5C45D3' },
                  px: 4,
                  py: 1.5,
                  borderRadius: 50,
                }}
              >
                Next
              </Button>
            </>
          )}
          {signupStep === 2 && (
            <>
            <Box sx={{ mb: 2, minHeight: '80vh', display: 'flex',flexDirection: 'column', justifyContent: 'between', gap: 16 }}>
            <Box sx={{ }}>
                <Typography variant="h5" sx={{ fontSize: { xs: '24px', sm: '30px' }, fontWeight: 700, color: '#6D53F4' }}>
                  How Old Are You?
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500, color: '#666', mt: 1 }}>
                  Select your date of birth
                </Typography>
              </Box>
              <DatePicker
                label="Date of Birth"
                value={userProfile.dob}
                onChange={(newValue) => handleProfileChange('dob', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      mb: 6,
                      maxWidth: { xs: '80%', sm: '300px' },
                      mx: 'auto',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    }}
                  />
                )}
                maxDate={new Date()}
              />
              <Button
                onClick={handleProfileNext}
                sx={{
                  backgroundColor: '#6D53F4',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontWeight: 400,
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#5C45D3' },
                  px: 4,
                  py: 1.5,
                  mt: 12,
                  borderRadius: 50,
                }}
              >
                Next
              </Button>
            </Box>
          
            </>
          )}
          {signupStep === 3 && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontSize: { xs: '24px', sm: '30px' }, fontWeight: 700, color: '#6D53F4' }}>
                  Select Up to 5 Interests
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500, color: '#666', mt: 1 }}>
                  Discover meaningful connections by selecting your interests
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 6, justifyContent: 'center' }}>
                {interestsList.map(interest => (
                  <Grid item xs={4} sm={3} md={2.4} key={interest.name}>
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
                        height: { xs: '50px', sm: '60px' },
                       
                      }}
                    >
                      {interest.icon}
                      <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{interest.name}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Button
                onClick={handleProfileNext}
                sx={{
                  backgroundColor: '#6D53F4',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontWeight: 400,
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#5C45D3' },
                  px: 4,
                  py: 1.5,
                  borderRadius: 50,
                }}
              >
                Next
              </Button>
            </>
          )}
          {signupStep === 4 && (
            <>
              <Box sx={{ mb: 12 }}>
                <Typography variant="h5" sx={{ fontSize: { xs: '24px', sm: '30px' }, fontWeight: 700, color: '#6D53F4' }}>
                  Describe Yourself
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500, color: '#666', mt: 1 }}>
                  Tell us a bit about yourself
                </Typography>
              </Box>
              <TextField
                label="Bio"
                value={userProfile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={{
                  mb: 6,
                  maxWidth: { xs: '90%', sm: '500px' },
                  mx: 'auto',
                  '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: { xs: '16px', sm: '18px' }, backgroundColor: '#f4f5f9' },
                }}
              />
              <Button
                onClick={handleProfileNext}
                sx={{
                  backgroundColor: '#6D53F4',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontWeight: 400,
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#5C45D3' },
                  px: 4,
                  py: 1.5,
                  borderRadius: 50,
                  mt: 18,
                }}
              >
                Next
              </Button>
            </>
          )}
          {signupStep === 5 && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontSize: { xs: '24px', sm: '30px' }, fontWeight: 700, color: '#6D53F4' }}>
                  Upload Your Photos
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '14px', sm: '16px' }, fontWeight: 500, color: '#666', mt: 1 }}>
                  To boost your daily match potential, upload your photos
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2, p: 2 ,  borderRadius: 2, display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', }}>
                <Grid item xs={12} sm={7}>
                  <Box
                    sx={{
                      backgroundColor: '#F4F5F9',
                      borderRadius: 2,
                      height: { xs: '50vw', sm: '260px' },
                      maxHeight: '260px',
                      width: '100%',
                      minWidth: '260px',
                      mx: 'auto',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                     
                    }}
                  >
                    {userProfile.photos[0] ? (
                      <>
                        <img src={userProfile.photos[0]} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        <Button
                          onClick={() => fileInputRefs.current[0].click()}
                          sx={{
                            position: 'absolute',
                            bottom: 10,
                            backgroundColor: '#6D53F4',
                            color: '#FFFFFF',
                            '&:hover': { backgroundColor: '#5C45D3' },
                            fontSize: { xs: '12px', sm: '14px' },
                          }}
                        >
                          Change Photo
                        </Button>
                      </>
                    ) : (
                      <IconButton onClick={() => fileInputRefs.current[0].click()} sx={{ color: '#6D53F4' }}>
                        <Add sx={{ fontSize: { xs: 50, sm: 60 } }} />
                      </IconButton>
                    )}
                    <input type="file" accept="image/*" ref={el => (fileInputRefs.current[0] = el)} onChange={(e) => handlePhotoUpload(0, e)} style={{ display: 'none' }} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Box sx={{ display: 'flex', gap: 2, height: '100%', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: '#F4F5F9',
                        borderRadius: 2,
                        height: { xs: '30vw', sm: '180px' },
                        maxHeight: '180px',
                        width: '100%',
                        minWidth: '125px',
                        mx: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        
                      }}
                    >
                      {userProfile.photos[1] ? (
                        <img src={userProfile.photos[1]} alt="Photo 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <IconButton onClick={() => fileInputRefs.current[1].click()} sx={{ color: '#6D53F4' }}>
                          <Add sx={{ fontSize: { xs: 40, sm: 50 } }} />
                        </IconButton>
                      )}
                      <input type="file" accept="image/*" ref={el => (fileInputRefs.current[1] = el)} onChange={(e) => handlePhotoUpload(1, e)} style={{ display: 'none' }} />
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: '#F4F5F9',
                        borderRadius: 2,
                        height: { xs: '30vw', sm: '180px' },
                        maxHeight: '180px',
                        width: '100%',
                        minWidth: '125px',
                        mx: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {userProfile.photos[2] ? (
                        <img src={userProfile.photos[2]} alt="Photo 3" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <IconButton onClick={() => fileInputRefs.current[2].click()} sx={{ color: '#6D53F4' }}>
                          <Add sx={{ fontSize: { xs: 40, sm: 50 } }} />
                        </IconButton>
                      )}
                      <input type="file" accept="image/*" ref={el => (fileInputRefs.current[2] = el)} onChange={(e) => handlePhotoUpload(2, e)} style={{ display: 'none' }} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Button
                onClick={handleProfileNext}
                sx={{
                  backgroundColor: '#6D53F4',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontWeight: 400,
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#5C45D3' },
                  px: 4,
                  py: 1.5,
                  mt: 6,
                  borderRadius: 50,
                }}
              >
                Finish
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ height: { xs: '5vh', sm: '10vh' } }} />
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#FFFFFF',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            width: { xs: '80%', sm: '400px' },
            maxWidth: '90%',
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#242424', fontSize: { xs: '18px', sm: '20px' } }}>
              {modalMessage}
            </Typography>
            <Button
              onClick={() => setModalOpen(false)}
              sx={{
                backgroundColor: '#6D53F4',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#5C45D3' },
                borderRadius: 50,
                px: 4,
                py: 1,
              }}
            >
              OK
            </Button>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default ProfileSetup;