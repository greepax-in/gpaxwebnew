"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import MegaMenu from "./MegaMenu";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const MotionDiv = motion.div;
const MotionButtonDiv = motion.div;

const menuItems = ["Paper Bags", "Paper Boxes", "Paper Covers"];

export default function MainMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuClick = (item: string) => {
    setOpenMenu(item);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  return (
    <ClickAwayListener onClickAway={handleCloseMenu}>
      <Box
        sx={{
          width: "100%",
          minHeight: "64px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: 1,
          position: "relative",
        }}
      >
        <MotionDiv
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.2,
              background: "#1B5E20", // Dark green to match AppBar
              borderRadius: "50px",
              padding: "0.3rem 0.8rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            {menuItems.map((item) => (
              <MotionButtonDiv
                key={item}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300 }}
                layout
              >
                <Button
                  sx={{
                    color: openMenu === item ? "#1B5E20" : "#E8F5E9",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    padding: "0.3rem 1rem",
                    borderRadius: "50px",
                    background: openMenu === item ? "#FFFFFF" : "transparent",
                    boxShadow:
                      openMenu === item ? "0 0 0 3px #A5D6A7" : "none",
                    textTransform: "none",
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: openMenu === item ? "#FFFFFF" : "#2E7D32",
                      color: openMenu === item ? "#1B5E20" : "#FFFFFF",
                    },
                  }}
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                  {openMenu === item && (
                    <motion.div
                      layoutId="menuHighlight"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50px",
                        background: "#FFFFFF",
                        zIndex: -1,
                      }}
                    />
                  )}
                </Button>
              </MotionButtonDiv>
            ))}
          </Box>
        </MotionDiv>

        <MegaMenu
          open={!!openMenu}
          menuType={openMenu as "Paper Bags" | "Paper Boxes" | "Paper Covers"}
        />
      </Box>
    </ClickAwayListener>
  );
}
