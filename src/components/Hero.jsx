import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

export default function Hero() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center', color: 'white' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontFamily: 'serif', 
            fontWeight: 400,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            mb: 4
          }}
        >
          Üdvözlünk!
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: 'serif', 
            fontStyle: 'italic',
            fontWeight: 300,
            mb: 6,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          Amikor a magyar ízek találkoznak a világgal. Tiszta, karakteres, őszinte ízek.
        </Typography>
          <Button 
            variant="outlined" 
            size="large"
            component={Link}
            to="/menu"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              borderRadius: 0,
              padding: '12px 36px',
              letterSpacing: '2px',
              '&:hover': {
                borderColor: '#d4af37',
                color: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.05)'
              }
            }}
          >
            Étlap
          </Button>
      </Container>
    </Box>
  );
}
