import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Container, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Desks() {
  const { user, loading: authLoading, addDesk } = useContext(AuthContext);
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newDeskName, setNewDeskName] = useState('');
  const [newDeskPassword, setNewDeskPassword] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || user.name !== 'admin')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchDesks = async () => {
    try {
      const fetchedDesks = await api.getDesks();
      setDesks(fetchedDesks);
    } catch (err) {
      setError(err.message || 'Hiba az asztalok lekérésekor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.name === 'admin') {
      fetchDesks();
    }
  }, [user]);

  const handleDelete = async (id, name) => {
    if (name === 'admin') {
        alert("Nem törölheted az admin asztalt!");
        return;
    }
    if (window.confirm(`Biztosan törölni szeretnéd az alábbi asztalt: ${name}?`)) {
       try {
           await api.deleteDesk(id);
           fetchDesks();
       } catch(err) {
           setError('Hiba történt a törlés során.');
       }
    }
  };

  const handleCreate = async (e) => {
      e.preventDefault();
      try {
          const res = await addDesk(newDeskName, newDeskPassword);
          if (res.success) {
              setNewDeskName('');
              setNewDeskPassword('');
              fetchDesks();
          } else {
              setError(res.message);
          }
      } catch (err) {
          setError('Hiba történt a hozzáadás során.');
      }
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', pt: 15, pb: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: 'serif', color: '#d4af37', mb: 4, letterSpacing: '1px' }}>
          Asztalok Kezelése
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError('')}>{error}</Alert>}

        <Paper sx={{ p: 4, mb: 4, backgroundColor: 'rgba(26, 26, 26, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
             <Typography variant="h5" sx={{ fontFamily: 'serif', color: '#d4af37', mb: 3 }}>Új Asztal Hozzáadása</Typography>
             <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                 <TextField
                     label="Asztal Neve"
                     required
                     value={newDeskName}
                     onChange={(e) => setNewDeskName(e.target.value)}
                     sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' } }, flex: 1, minWidth: '200px' }}
                 />
                 <TextField
                     label="Jelszó"
                     type="password"
                     required
                     value={newDeskPassword}
                     onChange={(e) => setNewDeskPassword(e.target.value)}
                     sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' } }, flex: 1, minWidth: '200px' }}
                 />
                 <Button type="submit" variant="contained" sx={{ backgroundColor: '#d4af37', color: '#000', '&:hover': { backgroundColor: '#b5952f' }, height: '56px', px: 4 }}>
                     Hozzáadás
                 </Button>
             </Box>
        </Paper>

        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(26, 26, 26, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Azonosító</TableCell>
                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Név</TableCell>
                <TableCell align="right" sx={{ color: '#d4af37', fontWeight: 'bold' }}>Műveletek</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {desks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', py: 4 }}>
                    Nincsenek asztalok.
                  </TableCell>
                </TableRow>
              ) : (
                desks.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell sx={{ color: 'white' }}>{d.id}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{d.name}</TableCell>
                    <TableCell align="right">
                      {d.name !== 'admin' && (
                          <Button 
                              onClick={() => handleDelete(d.id, d.name)}
                              sx={{ color: '#ff4444', border: '1px solid #ff4444' }}
                          >
                            Törlés
                          </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
