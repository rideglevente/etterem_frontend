import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Desks from './pages/Desks';
import { ThemeProvider, createTheme, responsiveFontSizes, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

let darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37', // Gold color for buttons
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

darkTheme = responsiveFontSizes(darkTheme);

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/desks" element={<Desks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
