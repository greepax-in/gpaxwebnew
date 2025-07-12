'use client';
import { Box, Typography } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";



export default function HeroCakeBoxes() {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Scale effect for the image
    const scaleTransform = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

    // Opacity effect for the image (visible only during its section)
    const opacityTransform = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0]);

    // Background color transition
    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 1],
        ["#f9f7f7ff", "#e49feaff"]
    );

    // Opacity effect for the title (fade out when scrolling ends)
    // const titleOpacityTransform = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

    const sectionHeight = "150vh"; // Adjust height to ensure no overlap

    return (
        <Box
            ref={sectionRef}
            component={motion.div}
            style={{ backgroundColor }}
            sx={{
                width: "100vw",
                height: sectionHeight,
                position: "relative",
                overflow: "hidden",
                // zIndex: -1, // Ensure Hero section is below AppBar
                // transform: "none", // Prevent scrolling effects from interfering
                // isolation: "isolate", // Ensure AppBar is unaffected by Hero page styles
            }}
        >
            {/* Cake Boxes Image (visible only during its section) */}
            <motion.img
                src="/images/home/ColorCakeBoxes.svg"
                alt="Cake Boxes"
                style={{
                    scale: scaleTransform,
                    opacity: opacityTransform,
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                    position: "fixed",
                    top: "15%",
                    left: "45%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                }}
                width={400}
                height={800}
                initial={{ opacity: 0 }}
                transition={{ duration: 1 }}
            />

            {/* Fixed Bottom-Left Title */}
            <motion.div
                style={{
                    // Fade out title when scrollYProgress reaches 0.5
                    opacity: useTransform(scrollYProgress, [0, 0.8], [1, 0]),
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
