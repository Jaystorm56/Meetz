import { Button, Typography, Box } from '@mui/material';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import animatedVideo from '../assets/images/front.mp4';
import meetzLogo from '../assets/images/meetz-whitelog.png';

const Welcome = ({ setActiveTab }) => {
  useEffect(() => {
    gsap.fromTo('.welcome-text', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.3 });
    gsap.fromTo('.welcome-button', { scale: 0 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 1 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between items-center text-center bg-background">
      <Box sx={{}}>
        <img src={meetzLogo} alt="Meetz Logo" className="h-20 mx-auto" />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          src={animatedVideo}
          autoPlay
          muted
          playsInline
          className="max-w-full max-h-[60vh] object-contain"
        />
      </Box>
      <Typography variant="h4" className="welcome-text text-accent text-2xl font-extrabold" sx={{ fontSize: 35, fontWeight: 550 }}>Discover Love</Typography>
      <Typography className="welcome-text text-secondary" sx={{ fontSize: 20, fontWeight: 500 }}>Meetz: Connecting hearts effortlessly.</Typography>
      <Button
        className="welcome-button"
        onClick={() => setActiveTab('Signup')}
        sx={{ backgroundColor: '#6D53F4', fontSize: '20px', fontWeight: 550, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' }, mb: 2, mt: 2, px: 4, py: 1.5, borderRadius: 50 }}
      >
        Let’s Get Started
      </Button>
      <Typography className="text-secondary mb-16" sx={{ fontSize: '19px', fontWeight: 500 }}>
        Already have an account?{' '}
        <Button onClick={() => setActiveTab('Login')} sx={{ color: '#6D53F4', fontSize: '19px', fontWeight: 500, textTransform: 'none' }}>Sign in</Button>
      </Typography>
      <Box sx={{ flex: 1 }} />
    </div>
  );
};

export default Welcome;