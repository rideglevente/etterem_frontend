import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ pt: 15, pb: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontFamily: 'serif', color: '#d4af37', fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'serif', mb: 4 }}>
          Az oldal nem található
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 6 }}>
          Sajnáljuk, de a keresett oldal nem létezik, vagy időközben áthelyezésre került.
        </Typography>
        <Button 
          component={Link}
          to="/"
          variant="outlined" 
          size="large"
          sx={{ 
            color: 'white', 
            borderColor: 'white',
            borderRadius: 0,
            padding: '10px 30px',
            letterSpacing: '1px',
            '&:hover': {
              borderColor: '#d4af37',
              color: '#d4af37',
              backgroundColor: 'rgba(212, 175, 55, 0.05)'
            }
          }}
        >
          Vissza a főoldalra
        </Button>
      </Container>
    </Box>
  );
}
