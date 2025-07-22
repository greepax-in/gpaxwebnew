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
                marginTop: "0px",
                height: "15vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "30px",
                background: "linear-gradient(120deg, #1B5E20 0%, #A5D6A7 100%)", // Updated green blend
                textAlign: "left",
            }}
        >
            <Typography
                variant="h5"
                style={{
                    fontWeight: 700,
                    color: "#ffffff",
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
