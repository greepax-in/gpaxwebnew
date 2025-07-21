'use client';

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";

const words = [
    "Eco-Friendly",
    "Made in India",
    "Save the Nature",
];

const MobileHero: React.FC = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 2000); // Change word every 2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            style={{
                marginTop: "-10px", // Ensure no extra space
                height: "15vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // Vertically center
                alignItems: "flex-start", // Horizontally left
                background: "linear-gradient(65deg, #187c52ff 55%, #89fad6 85%)",
                textAlign: "left",
                padding: "30px",
            }}
        >
            <Typography
                variant="h5"
                style={{
                    fontWeight: 700,
                    color: "#fff",
                }}
            >
                <motion.div
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                        duration: 0.5,
                    }}
                    style={{
                        display: "inline-block",
                    }}
                >
                    {words[currentWordIndex]}
                </motion.div>
            </Typography>
        </section>
    );
};

export default MobileHero;