'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const categories = [
	{
		label: 'Paper Bags',
		icon: '/images/home/productcategories/paperbags/kraft-paper-bag.svg',
	},
	{
		label: 'Paper Covers',
		icon: '/images/home/productcategories/papercovers/10.svg',
	},
	{
		label: 'Paper Boxes',
		icon: '/images/home/productcategories/paperboxes/kraft-cake-boxes.svg',
	},
];

const LazadaStyleMenu: React.FC = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<>
			<Typography
				variant="h6"
				sx={{
					textAlign: 'center',
					fontSize: '1rem',
					fontWeight: 'bold',
					color: '#0b0701ff',
          backgroundColor: '#a3daf8ff',
		  					borderTopLeftRadius: 16,
					borderTopRightRadius: 16,
        //   textRendering: 'optimizeLegibility',
					mb: 2,
					mt: -2,
				}}
			>
				Our Products
			</Typography>
			<Box
				component="nav"
				sx={{
					// position: 'sticky',
					top: '56px', // Height of your mobile AppBar
					zIndex: 1200, // Ensure it's above other elements
					px: 1,
					pt: 1,
					pb: 1.5,
					background: 'linear-gradient(to bottom, #a3daf8ff 55%, #e2ffffff 100%)',
					overflowX: 'auto',
					whiteSpace: 'nowrap',
					display: 'flex',
					alignItems: 'center',
					gap: 5, // Increased gap between product categories
					justifyContent: 'center',
					mt: -3,
				}}
			>
				{categories.map((item, index) => (
					<motion.div
						key={index}
						whileTap={{ scale: 0.92 }}
						whileHover={{ scale: 1.03 }}
						style={{
							flexShrink: 0,
							textAlign: 'center',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onClick={() => setSelectedIndex(index)}
					>
						<Box
							sx={{
								width: 72,
								height: 72,
								borderRadius: '50%',
								backgroundColor: '#fff',
								border:
									selectedIndex === index
										? '2px solid #030ff4ff'
										: '2px solid transparent',
								boxShadow:
									selectedIndex === index
										? '0 0 0 3px rgba(76, 175, 80, 0.3)'
										: '0 2px 8px rgba(0,0,0,0.08)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								mb: 1,
								transition: 'all 0.3s ease',
								cursor: 'pointer',
							}}
						>
							<Box
								component="img"
								src={item.icon}
								alt={item.label}
								loading="lazy"
								sx={{
									width: 48,
									height: 48,
									objectFit: 'contain',
									fontWeight: 700,
								}}
							/>
						</Box>
						<Typography
							variant="caption"
							sx={{
								fontSize: '0.8rem',
								color: selectedIndex === index ? '#030ff4ff' : '#333',
								// fontWeight: selectedIndex === index ? '700' : 'normal',
								fontWeight: 'bold',
								maxWidth: 100, // Increased maxWidth to allow more space for text
								whiteSpace: 'normal', // Allow text wrapping
								overflow: 'hidden',
								textAlign: 'center', // Ensure text is centered
								textOverflow: 'ellipsis',
							}}
						>
							{item.label}
						</Typography>
					</motion.div>
				))}
			</Box>
		</>
	);
};

export default LazadaStyleMenu;
