'use client';
import { Box, Typography } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";


export default function HeroPaperBag() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Fast zoom (1 → 2.5 in first 40% of scroll)
  const scaleTransform = useTransform(scrollYProgress, [0, 0.4], [1, 2.5]);

  // Background color transition
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#f9f7f7ff", "#96d0f1"]
  );

  // Fade-out effect for the bag
  const opacityTransform = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  // Fade-out effect for the title
  const titleOpacityTransform = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <Box
      ref={sectionRef}
      component={motion.div}
      style={{ backgroundColor }}
      sx={{
        width: "100vw",
        height: "200vh", // enough scroll space for zoom
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Paper Bag Image (centered, zooming, and fading out) */}
      <motion.img
        src="/images/home/ColorPaperBag.svg"
        alt="Paper Bag"
        style={{
          scale: scaleTransform,
          opacity: opacityTransform, // Apply fade-out effect
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          position: "fixed",
          top: "35%",
          left: "45%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
        width={314}
        height={452}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Fixed Bottom-Left Title */}
      <motion.div
        style={{
          opacity: titleOpacityTransform, // Apply fade-out effect to the title
          position: "fixed",
          bottom: 40,
          left: 40,
          zIndex: 3,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: isMobile ? "3rem" : "4rem", // 3rem for mobile, 4rem otherwise
            fontWeight: "bold",
            color: "#222",
          }}
        >
          Sustainable Paper Packaging<br />
          Made in India
        </Typography>
      </motion.div>
    </Box>
  );
}
