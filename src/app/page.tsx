import { Box, Typography } from "@mui/material";
import HeroSection from '../../src/app/Home/HeroSection/page';
import AppBar from "@/components/AppBar/AppBar";

export default function Page() {
  return (
    <main>
      <AppBar />
      <HeroSection />
    </main>
  );
}