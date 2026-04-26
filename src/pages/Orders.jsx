import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Container, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, IconButton, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const statusMap = {
  'pending': 'Függőben',
  'cooking': 'Készül',
  'served': 'Felszolgálva',
  'paid': 'Fizetve'
};

function OrderRow({ order, user, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (open && items.length === 0) {
      setLoadingItems(true);
      api.getOrderItemsByOrderId(order.id)
        .then(data => setItems(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingItems(false));
    }
  }, [open, order.id, items.length]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'white' }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: 'white' }}>#{order.id}</TableCell>
        <TableCell sx={{ color: 'white' }}>{order.table_name || order.table_number}</TableCell>
        <TableCell>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
            <Select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              sx={{ 
                color: 'white', 
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.5)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                '.MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value="pending">{statusMap['pending'] || 'Függőben'}</MenuItem>
              <MenuItem value="cooking">{statusMap['cooking'] || 'Készül'}</MenuItem>
              <MenuItem value="served">{statusMap['served'] || 'Felszolgálva'}</MenuItem>
              <MenuItem value="paid">{statusMap['paid'] || 'Fizetve'}</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell sx={{ color: 'white' }}>{order.invoice_id || '-'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ color: '#d4af37', fontFamily: 'serif' }}>
                  Rendelés részletei
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Fizetés: <span style={{ color: 'white' }}>{order.payment_method === 'Cash' || order.payment_method === 'cash' ? 'Készpénz' : order.payment_method === 'Card' || order.payment_method === 'card' ? 'Bankkártya' : order.payment_method || '-'}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Borravaló: <span style={{ color: 'white' }}>{order.tip && order.tip > 0 ? `${order.tip} Ft` : '-'}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Fizetendő: <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{order.total_amount ? `${order.total_amount} Ft` : '-'}</span>
                  </Typography>
                  {order.billing_details && (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', mt: 0.5 }}>
                      Cég megnevezése: {order.billing_details}
                    </Typography>
                  )}
                </Box>
              </Box>
              {loadingItems ? (
                <CircularProgress size={24} sx={{ color: '#d4af37' }} />
              ) : items.length > 0 ? (
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Termék</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.7)' }}>Mennyiség</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.7)' }}>Ár / db</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((itemRow) => (
                      <TableRow key={itemRow.id}>
                        <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                          {itemRow.product_name || `Termék ID: ${itemRow.product_id}`}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{itemRow.quantity} db</TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{itemRow.current_price} Ft</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Nincsenek tételek ehhez a rendeléshez.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Orders() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await api.getOrders(user.name === 'admin' ? null : user.id);
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err.message || 'Hiba a rendelések lekérésekor.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setError('Nem sikerült módosítani a státuszt. Kérlek próbáld újra!');
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
          {user?.name === 'admin' ? 'Összes Rendelés' : 'Rendeléseim'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError('')}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(26, 26, 26, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 50 }} />
                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Azonosító</TableCell>
                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Asztal</TableCell>
                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Státusz</TableCell>
                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Számla ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', py: 4 }}>
                    Nincsenek megjeleníthető rendelések.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <OrderRow 
                    key={order.id} 
                    order={order} 
                    user={user} 
                    onStatusChange={handleStatusChange} 
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
