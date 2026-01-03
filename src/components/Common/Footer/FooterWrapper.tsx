// CODEX_PATCH_BEGIN
// FILE: src/components/Common/Footer/FooterWrapper.tsx

'use client';

import { Box, Typography, Link, Stack } from '@mui/material';

export default function FooterWrapper(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mb: 1 }}
      >
        <Link href="/paper-bags" underline="hover" color="text.secondary">
          Paper Bags
        </Link>
        <Link href="/paper-covers" underline="hover" color="text.secondary">
          Paper Covers
        </Link>
        <Link href="/paper-boxes" underline="hover" color="text.secondary">
          Paper Boxes
        </Link>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} GreenPax. All rights reserved.
      </Typography>
    </Box>
  );
}
// CODEX_PATCH_END
