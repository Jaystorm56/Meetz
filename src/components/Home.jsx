import { useState, useRef, useEffect } from 'react';
import { Card, IconButton, Modal, Box } from '@mui/material';
import { Close, Favorite, Person } from '@mui/icons-material';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LuHeartHandshake } from "react-icons/lu";
import TinderCard from 'react-tinder-card';
import { gsap } from 'gsap';
import Draggable from 'gsap/Draggable';
import MatchProfile from './MatchProfile';

const API_URL = 'https://meetz-api.onrender.com';

// nothing to see just a comment

const Home = ({ users, currentIndex, setCurrentIndex, token, setActiveTab, setLoading, onMatch, refetchUsers, refetchMatches }) => {
  console.log('Home component rendered', users);
  const cardRef = useRef(null);
  const [showMatchProfile, setShowMatchProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
    gsap.registerPlugin(Draggable);
  }, [currentIndex]);

  const onSwipe = (direction) => {
    if (cardRef.current && cardRef.current.cardRef && cardRef.current.cardRef.current) {
      const cardElement = cardRef.current.cardRef.current;
      if (direction === 'left') gsap.to(cardElement, { x: -500, rotation: -15, opacity: 0, duration: 0.5, ease: 'power2.out' });
      else if (direction === 'right') gsap.to(cardElement, { x: 500, rotation: 15, opacity: 0, duration: 0.5, ease: 'power2.out' });
    }
  };

  const onCardLeftScreen = (direction) => {
    if (currentIndex >= 0) {
      const user = users[currentIndex];
      setCurrentIndex(prev => prev - 1);

      if (direction === 'right') {
        const token = localStorage.getItem('accessToken');
        fetch(`${API_URL}/likes`, { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }, 
          body: JSON.stringify({ userId: user._id })
        })
          .then(res => res.json())
          .then(data => {
            if (data.match) {
              onMatch(user);
              refetchUsers();
            }
          })
          .catch(err => console.error('Error posting like:', err));
      }
    }
  };

  const handleIconClick = (direction, event) => {
    event.stopPropagation();
    if (cardRef.current) cardRef.current.swipe(direction);
  };

  const handleChatClick = (event) => {
    event.stopPropagation();
    setActiveTab('Chat');
  };

  const handleCardClick = (user) => {
    console.log("its clicking");
    setSelectedUser(user);
    setShowMatchProfile(true);
  };

  const handleMatch = (user) => {
    setSelectedUser(user);
    setShowMatchProfile(true);
  };

  const handleLike = () => {
    if (currentUser) {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      fetch(`${API_URL}/like`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ likedUserId: currentUser._id })
      })
        .then(() => {
          refetchUsers();
          refetchMatches();
        })
        .catch(err => console.error('Error liking user:', err))
        .finally(() => setLoading(false));
    }
  };

  const handleDislike = () => {
    if (currentUser) {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      fetch(`${API_URL}/dislike`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dislikedUserId: currentUser._id })
      })
        .then(() => {
          refetchUsers();
        })
        .catch(err => console.error('Error disliking user:', err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      {(Array.isArray(users) ? users : []).map((user, index) => (
        index <= currentIndex && (
          <TinderCard
            key={user._id}
            ref={index === currentIndex ? cardRef : null}
            onSwipe={(dir) => onSwipe(dir)}
            onCardLeftScreen={(dir) => onCardLeftScreen(dir)}
            preventSwipe={['up', 'down']}
            className={`absolute w-[93%] max-w-md ${index === currentIndex ? 'z-10' : 'z-0'}`}
            sx={{ flexGrow: 1 }}
          >
            <Card
              onClick={() => handleCardClick(user)}
              className="shadow-lg h-[460px] rounded-lg overflow-hidden"
              sx={{
                height: {
                  xs: '460px', // < 414px
                  sm: '530px', // ≥ 414px
                  minHeight: '400px',
                  '@media (max-width: 413.99px)': { height: '460px' },
                  '@media (min-width: 414px)': { height: '530px' },
                }
              }}
            >
              <div className="relative h-full w-full">
                {user.photos && user.photos[0] ? (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.photos[0]})` }}
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                      <Person sx={{ fontSize: 120, color: '#FFFFFF' }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6D53F4] to-[#A78BFA] opacity-50"></div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <div className="absolute bottom-16 left-4 right-4 text-white">
                  <h2 className="text-3xl font-bold">{user.firstName}, {user.age}</h2>
                  <p className="text-sm sm:text-sm">{user.bio}</p>
                </div>
                <div className="absolute bottom-2 left-0 right-0 flex justify-around">
                  <IconButton onClick={(e) => handleIconClick('left', e)} sx={{ color: 'red', backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
                    <Close fontSize="large" />
                  </IconButton>
                  <IconButton onClick={(e) => handleChatClick(e)} sx={{ color: 'green', backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
                    <IoChatboxEllipsesOutline fontSize="35px" />
                  </IconButton>
                  <IconButton onClick={(e) => handleIconClick('right', e)} sx={{ color: '#6D53F4', backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
                    <LuHeartHandshake fontSize="35px" />
                  </IconButton>
                </div>
              </div>
            </Card>
          </TinderCard>
        )
      ))}
      {currentIndex < 0 && <p className="text-center text-secondary">No more profiles to swipe!</p>}
      <Modal open={showMatchProfile} onClose={() => setShowMatchProfile(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: '80px', pb: '68px' }}>
        <MatchProfile user={selectedUser} onClose={() => setShowMatchProfile(false)} />
      </Modal>
    </>
  );
};

export default Home;