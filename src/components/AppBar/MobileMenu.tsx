import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ChatIcon from '@mui/icons-material/Chat';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const MobileMenu: React.FC = () => {
  const [selected, setSelected] = useState('Home');

  const menuItems = [
    { label: 'Home', icon: <HomeIcon /> },
    { label: 'Paper Bags', icon: <ShoppingBagIcon /> },
    { label: 'Paper Covers', icon: <LocalOfferIcon /> },
    { label: 'Paper Boxes', icon: <CardGiftcardIcon /> },
    { label: 'Chat', icon: <ChatIcon /> },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        py: 1,
        '@media (min-width:600px)': {
          display: 'none',
        },
      }}
    >
      {menuItems.map((item) => (
        <IconButton
          key={item.label}
          onClick={() => setSelected(item.label)}
          sx={{
            color: selected === item.label ? '#1976d2' : '#666',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {item.icon}
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              fontWeight: selected === item.label ? 'bold' : 'normal',
              color: selected === item.label ? '#1976d2' : '#666',
            }}
          >
            {item.label}
          </Typography>
        </IconButton>
      ))}
    </Box>
  );
};

export default MobileMenu;
