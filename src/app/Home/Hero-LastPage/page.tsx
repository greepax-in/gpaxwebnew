'use client';
import { Box, Typography, Button } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState } from "react";

export default function Home() {


  const sectionHeight = "50vh"; // Adjust height to ensure no overlap

  return (
    <div>
  

      {/* Last Section */}
      <Box
        sx={{
          width: "vw",
          height: sectionHeight, // Adjusted height
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#96d0f1ff",
        }}
      >
        
        <Box
          sx={{
            width: "75vw", // Reduced width by 25%
            margin: "0 auto", // Center horizontally
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", // Ensure vertical centering within parent
          }}
        >
          <Typography variant="h3" align="center">
            Green Packs Enterprises is a leading Indian manufacturer of sustainable
            paper packaging solutions, offering customizable
            <Box
              component="span"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                fontWeight: 'bold',
                px: '0.4em',
                borderRadius: '0.3em',
                display: 'inline-block',
              }}
            >
              bags, boxes, and covers
            </Box>
            that help businesses replace plastic packaging responsibly.

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/products"
                sx={{ borderRadius: '2em', textTransform: 'none', fontWeight: 'bold' }}
              >
                Explore Products
              </Button>
            </Box>
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
