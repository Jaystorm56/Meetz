import { Modal, Box, Typography, IconButton, Button, CircularProgress } from '@mui/material';
import { ArrowBack, Person } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import matchedBackground from '../assets/images/matchedBackground.png';

// Animation keyframes
const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-100px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
`;

const MatchedModal = ({ open, onClose, currentUser, matchedUser, setActiveTab, setSelectedUser }) => {
  // Guard against null or undefined props
  if (!currentUser || !matchedUser) {
    return null;
  }

  // Calculate match percentage based on shared interests
  const sharedInterests = (currentUser.interests || []).filter(interest => (matchedUser.interests || []).includes(interest));
  const totalInterests = Math.max((currentUser.interests || []).length, (matchedUser.interests || []).length);
  const matchPercentage = totalInterests > 0 ? Math.round((sharedInterests.length / totalInterests) * 100) : 0;

  const handleChatNow = () => {
    setSelectedUser(matchedUser);
    setActiveTab('Chat');
    onClose();
  };

  const handleKeepSwiping = () => {
    setActiveTab('Home');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, left: 16, color: '#6D53F4' }}
        >
          <ArrowBack />
        </IconButton>

        {/* Header Text */}
        <Typography variant="h5" sx={{ mt: 4, textAlign: 'center', fontSize: '30px' ,fontWeight: 'bold' }}>
          <span style={{ color: '#000000' }}>You and </span>
          <span style={{ color: '#6D53F4' }}>{matchedUser.firstName}</span>
          <span style={{ color: '#000000' }}> liked each other!</span>
        </Typography>

        {/* Profile Pics and Percentage Container */}
        <Box
          sx={{
            position: 'relative',
            width: 385,
            height: 310,
            backgroundImage: `url(${matchedBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          {/* Current User Pic (Top Left) */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              left: -1,
              width: 170,
              height: 170,
              borderRadius: '50%',
              overflow: 'hidden',
              animation: `${fadeInLeft} 1s ease-in-out`,
              border: '7px solid #FFFFFF',
              backgroundColor: currentUser.photos && currentUser.photos[0] ? 'transparent' : '#E0E0E0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {currentUser.photos && currentUser.photos[0] ? (
              <img src={currentUser.photos[0]} alt={currentUser.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Person sx={{ fontSize: 60, color: '#6D53F4' }} />
            )}
          </Box>

          {/* Matched User Pic (Bottom Right) */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -20,
              right: -1,
              width: 170,
              height: 170,
              borderRadius: '50%',
              overflow: 'hidden',
              animation: `${fadeInRight} 1s ease-in-out`,
              border: '7px solid #FFFFFF',
              backgroundColor: matchedUser.photos && matchedUser.photos[0] ? 'transparent' : '#E0E0E0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {matchedUser.photos && matchedUser.photos[0] ? (
              <img src={matchedUser.photos[0]} alt={matchedUser.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Person sx={{ fontSize: 60, color: '#6D53F4' }} />
            )}
          </Box>

          {/* White Background with Circular Progress and Percentage Inside */}
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '50%',
              width: 140,
              height: 140,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <CircularProgress
              variant="determinate"
              value={matchPercentage}
              size={99}
              thickness={3}
              sx={{ color: '#6D53F4' }}
            />
            <Typography
              variant="h5"
              sx={{
                position: 'absolute',
                color: '#6D53F4',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {matchPercentage}%
            </Typography>
          </Box>
        </Box>

        {/* Text and Buttons Below */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '40px' }}>
            <span style={{ color: '#000000' }}>It’s a </span>
            <span style={{ color: '#6D53F4' }}>Match</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#797979', fontSize: '18px', mt: 1 }}>
            Get the Chat Started Now!
          </Typography>

          <Button
            onClick={handleChatNow}
            sx={{
              backgroundColor: '#6D53F4',
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#5C45D3' },
              mt: 2,
              borderRadius: 50,
              px: 4,
              py: 1,
              fontWeight: 900,
               fontSize: '17px'
            }}
          >
            Chat Now
          </Button>

          <Button
            onClick={handleKeepSwiping}
            sx={{ color: '#6D53F4', fontSize: '18px', mt: 1 }}
          >
            Keep Swiping
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MatchedModal;