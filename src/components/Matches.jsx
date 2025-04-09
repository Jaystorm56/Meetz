import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Person, ArrowBack, Search } from '@mui/icons-material';

const Matches = ({ matches, setActiveTab, setSelectedUser }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Online', 'Newest', 'Nearby'];

  return (
    <div className="w-full flex flex-col">
      {/* Custom Header */}
      <AppBar position="static" sx={{ backgroundColor: '#6D53F4', padding: 2 }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setActiveTab('Home')}
            sx={{ color: '#FFFFFF' }}
          >
            <ArrowBack />
          </IconButton>
          <h2 className="text-xl font-bold text-white flex-grow text-center">Matches</h2>
          <IconButton
            edge="end"
            onClick={() => console.log('Search - Coming soon!')}
            sx={{ color: '#FFFFFF' }}
          >
            <Search />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Body (Filter Tabs + Matches Grid) */}
      <div
        className="w-full bg-white border border-gray-300 rounded-t-3xl -mt-6"
        style={{ paddingTop: '2rem' }}
      >
        {/* Filter Tabs */}
        <div className="w-full flex justify-center space-x-2 px-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-white text-[#6D53F4] shadow-sm'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {matches.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setActiveTab('Chat');
                  setSelectedUser(user);
                }}
                className="relative w-full h-64 rounded-lg overflow-hidden cursor-pointer"
              >
                {/* Background Image or Person Icon */}
                {user.photos && user.photos[0] ? (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${user.photos[0]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <Person sx={{ fontSize: 64, color: '#FFFFFF' }} />
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#6D53F4] to-[#A78BFA] opacity-50"></div>

                {/* Match Percentage */}
                <div className="absolute top-2 right-2 bg-[#34C759] text-white text-xs font-bold rounded-full px-2 py-1">
                  {user.matchPercentage || 90}% Match
                </div>

                {/* User Info */}
                <div className="absolute bottom-2 left-2 text-white">
                  <Typography variant="h6" className="font-bold">
                    {user.firstName}, {user.age}
                  </Typography>
                  <Typography variant="body2">
                    {user.distance || '12.6 km'} away
                  </Typography>
                </div>

                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#34C759] rounded-full border-2 border-white"></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary text-center p-4">No mutual matches yet. Keep swiping!</p>
        )}
      </div>
    </div>
  );
};

export default Matches;