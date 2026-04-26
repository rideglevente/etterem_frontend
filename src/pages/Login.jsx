import React, { useState, useContext } from 'react';
import { Box, Typography, Button, Container, TextField, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [desk, setDesk] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(desk, password);
    if (result.success) {
      if (desk === 'admin') {
        navigate('/desks');
      } else {
        navigate('/orders');
      }
    } else {
      setError(result.message || 'Sikertelen bejelentkezés.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url("https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(26, 26, 26, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: 2,
          }}
        >
            <Typography
              variant="h4"
              noWrap
              sx={{
                mr: 2,
                fontFamily: 'serif',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'white',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  color: '#d4af37',
                }
              }}
            >
              LOGO
            </Typography>
          <Typography component="h2" variant="h5" sx={{ mb: 4, fontFamily: 'serif', fontWeight: 300, letterSpacing: '1px' }}>
            Bejelentkezés
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="desk"
              label="Asztal neve"
              name="desk"
              autoComplete="username"
              autoFocus
              value={desk}
              onChange={(e) => setDesk(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Jelszó"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                backgroundColor: '#d4af37',
                color: '#000',
                fontWeight: 'bold',
                letterSpacing: '1px',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#b5952f',
                }
              }}
            >
              Belépés
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
