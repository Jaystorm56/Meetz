import { useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Button, CardMedia } from '@mui/material';
import { Close, Chat } from '@mui/icons-material';
import { IoGameControllerOutline, IoMusicalNotesOutline, IoBookOutline, IoLanguageOutline, IoCameraOutline } from 'react-icons/io5';
import { gsap } from 'gsap';
import Draggable from 'gsap/Draggable';

const MatchProfile = ({ user, onClose }) => {
  const draggableRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(Draggable);

    const draggable = Draggable.create(draggableRef.current, {
      type: 'y',
      bounds: { minY: 0, maxY: 400 }, // Initial height (~100px) to full height (~500px)
      onDrag: (e) => {
        const y = e.y;
        if (y > 300) {
          gsap.to(draggableRef.current, { y: 400, duration: 0.3, ease: 'power2.out' });
        } else if (y < 100) {
          gsap.to(draggableRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
        }
      },
      onDragEnd: (e) => {
        const y = e.y;
        if (y > 200) {
          gsap.to(draggableRef.current, { y: 400, duration: 0.3, ease: 'power2.out' });
        } else {
          gsap.to(draggableRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
        }
      },
    });

    return () => draggable[0].kill(); // Cleanup
  }, []);

  const interests = user?.interests || ['Gaming', 'Music', 'Book', 'Language', 'Photography'];
  const photos = user?.photos || ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'];

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '400px', mx: 'auto', bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
      {/* Profile Picture */}
      <CardMedia
        component="img"
        image={user?.photos?.[0] || 'https://via.placeholder.com/400'}
        alt={`${user?.firstName}'s profile`}
        sx={{ width: '100%', height: '400px', objectFit: 'cover' }}
      />
      <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
        <IconButton onClick={onClose} sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 1, p: 0.5 }}>
        <Typography sx={{ color: 'white', fontSize: 14 }}>90% Match</Typography>
      </Box>
      <Box sx={{ position: 'absolute', top: 8, right: 8, ml: 4, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 1, p: 0.5 }}>
        <Typography sx={{ color: 'white', fontSize: 14 }}>12.6 km away</Typography>
      </Box>

      {/* Draggable Container */}
      <Box
        ref={draggableRef}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '500px',
          bgcolor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: 2,
          p: 2,
          y: 0,
          transition: 'y 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{user?.firstName || 'Marvin McKinney'}, {user?.age || 22} 😊</Typography>
          <IconButton sx={{ ml: 'auto', color: '#6D53F4' }}>
            <Chat />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ mb: 2 }}>{user?.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Read more'}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Interest</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <IconButton sx={{ bgcolor: '#F5F5F5', '&:hover': { bgcolor: '#E0E0E0' } }}><IoGameControllerOutline /></IconButton>
          <IconButton sx={{ bgcolor: '#F5F5F5', '&:hover': { bgcolor: '#E0E0E0' } }}><IoMusicalNotesOutline /></IconButton>
          <IconButton sx={{ bgcolor: '#F5F5F5', '&:hover': { bgcolor: '#E0E0E0' } }}><IoBookOutline /></IconButton>
          <IconButton sx={{ bgcolor: '#F5F5F5', '&:hover': { bgcolor: '#E0E0E0' } }}><IoLanguageOutline /></IconButton>
          <IconButton sx={{ bgcolor: '#F5F5F5', '&:hover': { bgcolor: '#E0E0E0' } }}><IoCameraOutline /></IconButton>
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Marvin's info.</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Age</Typography>
          <Typography variant="body1">{user?.age || 22} Years</Typography>
          <Typography variant="body2">Height</Typography>
          <Typography variant="body1">{user?.height || '175 cm'}</Typography>
          <Typography variant="body2">Speaks</Typography>
          <Typography variant="body1">{user?.language || 'English'}</Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Gallery</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {photos.map((photo, index) => (
            <CardMedia key={index} component="img" image={photo} sx={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 1 }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Button variant="contained" sx={{ bgcolor: '#E0E0E0', color: 'black', '&:hover': { bgcolor: '#B0B0B0' } }}>X</Button>
          <Button variant="contained" sx={{ bgcolor: '#6D53F4', color: 'white', '&:hover': { bgcolor: '#5C45D3' } }}>❤️</Button>
          <Button variant="contained" sx={{ bgcolor: '#FFD700', color: 'black', '&:hover': { bgcolor: '#E6C200' } }}>⭐</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MatchProfile;