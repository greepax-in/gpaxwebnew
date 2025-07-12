"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
// Ensure MegaMenu.tsx exists in the same folder, or update the path below if needed
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
          // background: "#f5f5f5",
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
              background: "#39b54a",
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
                layout // enables smooth layout animation
              >
                <Button
                  sx={{
                    color: openMenu === item ? "#2e8c3a" : "#fff",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    padding: "0.3rem 1rem",
                    borderRadius: "50px",
                    background: openMenu === item ? "#fff" : "transparent",
                    boxShadow:
                      openMenu === item ? "0 0 0 4px #39b54a55" : "none",
                    textTransform: "none",
                    position: "relative",
                    transition:
                      "background 0.3s, box-shadow 0.3s, color 0.3s",
                    "&:hover": {
                      background: openMenu === item ? "#fff" : "#2e8c3a",
                      color: openMenu === item ? "#2e8c3a" : "#fff",
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
                        background: "#fff",
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
          // anchorEl={null}
        />
      </Box>
    </ClickAwayListener>
  );
}