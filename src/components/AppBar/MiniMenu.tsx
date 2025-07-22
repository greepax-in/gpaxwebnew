import React from "react";
import { Box, Button } from "@mui/material";

interface MiniMenuProps {
  items: string[];
  onItemClick: (item: string) => void;
  selectedItem: string;
  style?: React.CSSProperties;
}

const MiniMenu: React.FC<MiniMenuProps> = ({ items, onItemClick, selectedItem, style }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1.2,
        background: "#1B5E20",
        borderRadius: "50px",
        padding: "0.3rem 0.8rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        ...style,
      }}
    >
      {items.map((item) => (
        <Button
          key={item}
          onClick={() => onItemClick(item)}
          sx={{
            color: selectedItem === item ? "#1B5E20" : "#E8F5E9",
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "0.3rem 1rem",
            borderRadius: "50px",
            background: selectedItem === item ? "#FFFFFF" : "transparent",
            textTransform: "none",
            position: "relative",
            transition: "all 0.3s ease",
            "&:hover": {
              background: selectedItem === item ? "#FFFFFF" : "#2E7D32",
              color: selectedItem === item ? "#1B5E20" : "#FFFFFF",
            },
          }}
        >
          {item}
        </Button>
      ))}
    </Box>
  );
};

export default MiniMenu;