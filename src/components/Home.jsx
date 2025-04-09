import { useRef } from 'react';
import { Card, IconButton } from '@mui/material';
import { Close, Chat, Favorite, Person } from '@mui/icons-material';
import TinderCard from 'react-tinder-card';
import { gsap } from 'gsap';

const API_URL = 'https://meetz-api.onrender.com';

const Home = ({ users, currentIndex, setCurrentIndex, token, setActiveTab, setLoading, onMatch, refetchUsers }) => {
  const cardRef = useRef(null);

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
        fetch(`${API_URL}/likes`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
          body: JSON.stringify({ userId: user._id })
        })
          .then(res => res.json())
          .then(data => {
            if (data.match) {
              onMatch(user);
              // Refetch users to update the swipe list after a match
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

  const handleChatClick = () => setActiveTab('Chat');

  return (
    <>
      {users.map((user, index) => (
        index <= currentIndex && (
          <TinderCard
            key={user._id}
            ref={index === currentIndex ? cardRef : null}
            onSwipe={(dir) => onSwipe(dir)}
            onCardLeftScreen={(dir) => onCardLeftScreen(dir)}
            preventSwipe={['up', 'down']}
            className={`absolute w-[93%] max-w-md ${index === currentIndex ? 'z-10' : 'z-0'}`}
          >
            <Card className="shadow-lg h-[450px] rounded-lg overflow-hidden">
              <div className="relative h-full w-full">
                {user.photos && user.photos[0] ? (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${user.photos[0]})`,
                    }}
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                      <Person sx={{ fontSize: 120, color: '#FFFFFF' }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6D53F4] to-[#A78BFA] opacity-50"></div>
                  </div>
                )}
                {/* Gradient Overlay at the Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-80"></div>

                {/* Text Overlay */}
                <div className="absolute bottom-16 left-4 right-4 text-white">
                  <h2 className="text-3xl font-bold">{user.firstName}, {user.age}</h2>
                  <p className="text-xl">{user.bio}</p>
                </div>

                {/* Icon Buttons */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-around">
                  <IconButton onClick={(e) => handleIconClick('left', e)} sx={{ color: 'red', backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
                    <Close fontSize="large" />
                  </IconButton>
                  <IconButton onClick={handleChatClick} sx={{ color: 'green', backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
                    <Chat fontSize="large" />
                  </IconButton>
                  <IconButton onClick={(e) => handleIconClick('right', e)} sx={{ color: '#6D53F4', backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
                    <Favorite fontSize="large" />
                  </IconButton>
                </div>
              </div>
            </Card>
          </TinderCard>
        )
      ))}
      {currentIndex < 0 && <p className="text-center text-secondary">No more profiles to swipe!</p>}
    </>
  );
};

export default Home;