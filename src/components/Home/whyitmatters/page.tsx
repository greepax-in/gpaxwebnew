'use client';

import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import Image from 'next/image';
// import { RefObject } from 'react';

type WhyItMattersProps = {
  sectionRefs: Record<'WhyItMatters', React.RefObject<HTMLDivElement | null>>;
};

const stats = [
  {
    icon: '/images/home/whyitmatters/plastic-cover.svg',
    title: 'Only 9% of plastic waste is recycled',
    description: 'The rest ends up in landfills, oceans, and our food chains.',
  },
  {
    icon: '/images/home/whyitmatters/turtles.svg',
    title: '100,000+ marine animals die each year',
    description: 'Plastic pollution is choking our oceans.',
  },
  {
    icon: '/images/home/whyitmatters/rain.svg',
    title: 'Sudden rains and floods are rising',
    description: 'Climate changes are becoming more frequent in India.',
  },
];

export default function WhyItMatters() {
  return (
    <div >
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 10 },
          px: { xs: 2, md: 6 },
          backgroundImage: 'url(/images/home/whyitmatters/cleannature.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            zIndex: 2,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              color="#2e7d32"
              sx={{ mb: 6 }}
            >
              Every Child Deserves a World with Clean Air, Water, and Soil
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {stats.map((item, i) => (
              <Grid size={{xs:8, md:4}}  key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      px: 2,
                      maxWidth: 300,
                      mx: 'auto',
                    }}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={64}
                      height={64}
                      style={{ marginBottom: '1rem' }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="text.primary"
                      sx={{ mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '1rem' }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ marginTop: '3rem' }}
          >
            <Typography
              variant="subtitle1"
              fontStyle="italic"
              color="text.primary"
              sx={{ fontSize: '1.1rem', fontWeight: 700, maxWidth: '600px', mx: 'auto' }}
            >
              We can’t undo the damage, but we can make better choices now.
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </div>
  );
}
