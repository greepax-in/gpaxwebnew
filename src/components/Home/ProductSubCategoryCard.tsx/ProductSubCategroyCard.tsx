// components/SubcategoryCard.tsx
"use client";
import { Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import Icon from "@mui/material/Icon";

interface Props {
  icon: string;
  label: string;
  onClick?: () => void;
}

export default function SubcategoryCard({ icon, label, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Paper
        elevation={3}
        sx={{
          px: 2,
          py: 1.5,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "#f1f8e9",
        }}
      >
        <Icon sx={{ fontSize: 40, color: "#2e7d32" }}>{icon}</Icon>
        <Typography variant="subtitle1" fontWeight={600} mt={1}>
          {label}
        </Typography>
      </Paper>
    </motion.div>
  );
}
