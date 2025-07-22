'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

type PWAPromptProps = {
  onInstall: () => void;
  onClose: () => void;
};

const PWAPrompt: React.FC<PWAPromptProps> = ({ onInstall, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Box
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 20,
          width: 300,
          bgcolor: '#ffffffee', // subtle translucent background
          borderRadius: 3,
          border: '1px solid #ddd',
          boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
          p: 2,
          zIndex: 1500,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ fontSize: '1rem', color: '#212121', mb: 2 }}
        >
          Get Offers & Notifications
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Button
            onClick={onInstall}
            fullWidth
            sx={{
              backgroundColor: '#1B5E20',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              padding: '12px',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#2E7D32',
              },
            }}
          >
            Install App
          </Button>

          <Button
            onClick={onClose}
            fullWidth
            variant="text"
            sx={{
              fontWeight: 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              color: '#616161',
              padding: '12px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            No Thanks
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default PWAPrompt;
