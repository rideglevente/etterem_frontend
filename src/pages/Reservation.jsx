import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function Reservation() {
  return (
    <Box sx={{ pt: 15, pb: 10, minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'serif', textAlign: 'center' }}>
          Asztalfoglalás
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          Hamarosan...
        </Typography>
      </Container>
    </Box>
  );
}
