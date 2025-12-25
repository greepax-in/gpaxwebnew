// FILE: src/components/Home/HomeHero.tsx
import Image from "next/image";
import { getHomepageWhatsAppLink } from "@/components/Common/WhatsAppCTA";
import { Container, Box, Stack, Typography, Button } from "@mui/material";

export default function HomeHero() {
  return (
    <section>
      <Container
        maxWidth="lg"
        sx={{
          minHeight: { xs: "80vh", md: "85vh" },
          display: "flex",
          alignItems: "center",
          py: { xs: 5, md: 7 },
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={{ xs: 4, md: 6 }}
          alignItems="center"
          width="100%"
        >
          {/* Copy */}
          <Box component="div" sx={{ flex: { xs: "0 0 100%", md: "0 0 55%" } }}>
            <Stack spacing={2}>
              <Typography variant="overline" sx={{ letterSpacing: "0.12em", fontWeight: 600 }}>
                India's Eco-Friendly Paper Packaging Manufacturer
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.4rem", md: "3.6rem" },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Custom Paper Bags, Boxes & Food Packaging - Built for Bulk
                Production
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
                We manufacture paper packaging for retail, QSR, and FMCG brands.
                Food-safe inks, controlled MOQs, and planned Pan-India dispatch
                support consistent, large-scale production.
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  component="a"
                  href={getHomepageWhatsAppLink("Homepage hero")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Talk to a packaging specialist about bulk paper packaging requirements"
                >
                  Talk to a Packaging Specialist
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Share packaging type, quantity band, and delivery timeline.
                Responses during business hours.
              </Typography>
            </Stack>
          </Box>

          {/* Visual */}
          <Box component="div" sx={{ flex: { xs: "0 0 100%", md: "0 0 45%" } }}>
            <Box
              sx={{
                maxWidth: { xs: 520, md: 640 },
                width: "100%",
                height: { xs: 300, md: 420 },
                marginInline: "auto",
                borderRadius: { xs: 20, md: 28 },
                border: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: "0 20px 48px rgba(15, 23, 42, 0.14)",
                backgroundColor: "#fff",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
              }}
            >
              <Image
                src="/images/home/hero/printed-multi-color.svg"
                alt="Printed eco-friendly paper bags and boxes from GreenPax"
                width={900}
                height={500}
                sizes="(max-width: 900px) 94vw, 640px"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                priority
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </section>
  );
}
