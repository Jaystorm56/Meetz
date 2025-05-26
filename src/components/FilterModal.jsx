import React from 'react';
import { Modal, Box, Typography, Button, IconButton, ToggleButton, ToggleButtonGroup, Slider, TextField, MenuItem, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';

const locations = [
  'New York, USA',
  'Los Angeles, USA',
  'London, UK',
  'Paris, France',
  'Berlin, Germany',
];

const style = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100vw',
  maxWidth: '100vw',
  bgcolor: '#fff',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  boxShadow: 24,
  p: 3,
  zIndex: 1300,
  minHeight: '70vh',
};

const purple = '#6D53F4';

const FilterModal = ({ open, onClose, filters, onChange, onReset, onApply }) => {
  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>Filter</Typography>
            <IconButton onClick={onClose}><Close /></IconButton>
          </Box>
          {/* Location */}
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Location</Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.location}
            onChange={e => onChange({ ...filters, location: e.target.value })}
            sx={{ mb: 2 }}
          >
            {locations.map(loc => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </TextField>
          {/* Interested In */}
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Interested In</Typography>
          <ToggleButtonGroup
            value={filters.interestedIn}
            exclusive
            onChange={(_, val) => val && onChange({ ...filters, interestedIn: val })}
            sx={{ mb: 2, width: '100%' }}
          >
            {['Women', 'Men', 'Both'].map(val => (
              <ToggleButton
                key={val}
                value={val}
                sx={{
                  flex: 1,
                  borderRadius: '20px',
                  height: 36,
                  mx: 0.5,
                  fontWeight: 600,
                  fontSize: 15,
                  color: filters.interestedIn === val ? '#fff' : purple,
                  backgroundColor: filters.interestedIn === val ? purple : '#F4F5F9',
                  '&.Mui-selected': {
                    backgroundColor: purple,
                    color: '#fff',
                  },
                  '&:not(.Mui-selected)': {
                    backgroundColor: '#F4F5F9',
                  },
                  border: 'none',
                }}
              >
                {val}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {/* Sort By */}
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Sort by</Typography>
          <ToggleButtonGroup
            value={filters.sortBy}
            exclusive
            onChange={(_, val) => val && onChange({ ...filters, sortBy: val })}
            sx={{ mb: 2, width: '100%' }}
          >
            {['Online', 'Popular'].map(val => (
              <ToggleButton
                key={val}
                value={val}
                sx={{
                  flex: 1,
                  borderRadius: '20px',
                  height: 36,
                  mx: 0.5,
                  fontWeight: 600,
                  fontSize: 13,
                  color: filters.sortBy === val ? '#fff' : purple,
                  backgroundColor: filters.sortBy === val ? purple : '#F4F5F9',
                  '&.Mui-selected': {
                    backgroundColor: purple,
                    color: '#fff',
                  },
                  '&:not(.Mui-selected)': {
                    backgroundColor: '#F4F5F9',
                  },
                  border: 'none',
                }}
              >
                {val}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {/* Distance */}
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Distance</Typography>
          <Slider
            value={filters.distance}
            onChange={(_, val) => onChange({ ...filters, distance: val })}
            valueLabelDisplay="auto"
            min={0}
            max={25}
            step={1}
            sx={{ color: purple, mb: 2 }}
          />
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="caption">0 Km</Typography>
            <Typography variant="caption">5 Km</Typography>
            <Typography variant="caption">10 Km</Typography>
            <Typography variant="caption">15 Km</Typography>
            <Typography variant="caption">20 Km</Typography>
            <Typography variant="caption">25 Km</Typography>
          </Box>
          {/* Age */}
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Age</Typography>
          <Slider
            value={filters.age}
            onChange={(_, val) => onChange({ ...filters, age: val })}
            valueLabelDisplay="auto"
            min={18}
            max={88}
            step={1}
            sx={{ color: purple, mb: 2 }}
          />
          <Box display="flex" justifyContent="space-between" mb={2}>
            {[18, 28, 38, 48, 58, 68, 78, 88].map(age => (
              <Typography key={age} variant="caption">{age}</Typography>
            ))}
          </Box>
          {/* Buttons */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={onReset} sx={{ borderRadius: 3, color: purple, borderColor: purple, width: '48%' }}>Reset Filter</Button>
            <Button variant="contained" onClick={onApply} sx={{ borderRadius: 3, background: purple, width: '48%' }}>Apply</Button>
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
};

export default FilterModal; 