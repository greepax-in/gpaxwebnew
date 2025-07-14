'use client';
import HeroPaperBag from '../Hero-PaperBag/page';
import HeroPaperCovers from '../Hero-PaperCovers/page';
import HeroCakeBoxes from '../Footer/page';
import LastSection from '../Footer2/page';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSectionPage() {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Control the visibility of LastSection based on CakeBoxes scroll completion
    const cakeBoxesEnd = 0.7; // Define the point where CakeBoxes scrolling ends
    const lastSectionYTransform = useTransform(
        scrollYProgress,
        [cakeBoxesEnd, 1], // Start LastSection scrolling after CakeBoxes ends
        [100, 0]
    );

    return (
        <main ref={sectionRef}>
            <HeroPaperBag />
            <HeroPaperCovers />
            <HeroCakeBoxes />
            <motion.div
                style={{
                    y: lastSectionYTransform, // Start scrolling LastSection only after CakeBoxes is completed
                    position: 'relative', // Ensure proper positioning
                    zIndex: 0, // Ensure LastSection does not interfere with AppBar
                }}
            >
                <LastSection />
            </motion.div>
        </main>
    );
}