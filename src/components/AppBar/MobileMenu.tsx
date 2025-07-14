import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, useMediaQuery, useTheme, IconButton, Menu, MenuItem, Popover, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';


interface MobileMenuProps {
    anchorEl: HTMLElement | null;
    handleMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    handlePaperBagsClick: (event: React.MouseEvent<HTMLElement>) => void;
}



const MobileMenu: React.FC<MobileMenuProps> = ({
    anchorEl,
    handleMenuClick,
    handleMenuClose,
    handlePaperBagsClick,
}) => {
    const router = useRouter();

    const navigateTo = (path: string) => {
        handleMenuClose();
        router.push(path);
    };

    return (
        <>
            <div id="menu-anchor-wrapper">
                <IconButton
                    color="inherit"
                    onClick={handleMenuClick}
                    style={{
                        padding: '6px',
                        margin: '2px 8px',
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </div>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => navigateTo('/')}>Home</MenuItem>
                <MenuItem onClick={handlePaperBagsClick}>Paper Bags</MenuItem>
                <MenuItem onClick={() => navigateTo('/products')}>Paper Boxes</MenuItem>
                <MenuItem onClick={() => navigateTo('/products')}>Paper Covers</MenuItem>
                <MenuItem onClick={() => navigateTo('/about')}>About Us</MenuItem>
                <MenuItem onClick={() => navigateTo('/contact')}>Contact</MenuItem>
            </Menu>
        </>
    );
};

export default MobileMenu;