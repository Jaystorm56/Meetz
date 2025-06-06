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
    <div className="min-h-[90vh] flex flex-col justify-between items-center text-center bg-background">
      <Box sx={{mt:4}}>
        <img src={meetzLogo} alt="Meetz Logo" className="h-12 mx-auto" />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt:2 , maxHeight:'100vh'}}>
        <video
          src={animatedVideo}
          autoPlay
          muted
          playsInline
          className="max-w-full max-h-[90vh] object-contain"
        />
      </Box>
      <Typography variant="h4" className="welcome-text text-accent text-2xl font-extrabold" sx={{ fontSize: 25, fontWeight: 550,mt:2 }}>Discover Love</Typography>
      <Typography className="welcome-text text-secondary" sx={{ fontSize: 11, fontWeight: 500 }}>Connecting hearts effortlessly.</Typography>
      <Button
        className="welcome-button"
        onClick={() => setActiveTab('Signup')}
        sx={{ backgroundColor: '#6D53F4', fontSize: '0.7rem', fontWeight: 300, color: '#FFFFFF', '&:hover': { backgroundColor: '#5C45D3' },  mt: 4, px: 8, py: 1.5, borderRadius: 50 }}
      >
        Let’s Get Started
      </Button>
      <Typography className="text-secondary" sx={{ fontSize: 13, fontWeight: 500 }}>
        Already have an account?{' '}
        <Button onClick={() => setActiveTab('Login')} sx={{ color: '#6D53F4', fontSize: 13, fontWeight: 500, textTransform: 'none', marginLeft: -1 }}>Sign in</Button>
      </Typography>
      <Box sx={{ flex: 1 }} />
    </div>
  );
};

export default Welcome;