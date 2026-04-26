import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container, Drawer, List, ListItem, Badge, Divider, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../api';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [desks, setDesks] = useState([]);
  const [selectedDesk, setSelectedDesk] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [tip, setTip] = useState(0);
  const [billingDetails, setBillingDetails] = useState('');

  useEffect(() => {
    if (cartOpen) {
      const fetchDesks = async () => {
        try {
          const fetchedDesks = await api.getDesks();
          setDesks(fetchedDesks.filter(desk => desk.name !== 'admin'));
        } catch (err) {
          console.error("Nem sikerült lekérni az asztalokat:", err);
        }
      };
      fetchDesks();
    }
  }, [cartOpen]);

  if (location.pathname === '/login') {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let priceVal;
      if (typeof item.price === 'string') {
          priceVal = parseInt(item.price.replace(/\D/g, ''), 10) || 0;
      } else {
          priceVal = Number(item.price);
      }
      return total + (priceVal * item.quantity);
    }, 0);
  };

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    const deskId = (user && user.name !== 'admin') ? user.id : selectedDesk;

    if (!deskId) {
      alert("Kérlek válaszd ki az asztalt a rendelés leadása előtt!");
      return;
    }

    setIsOrdering(true);
    try {
      const baseAmount = calculateTotal();
      const tipAmount = Number(tip) || 0;
      const totalAmount = baseAmount + tipAmount;

      // 1. Rendelés létrehozása (Orders tábla)
      const orderData = { status: 'pending', table_number: deskId };
      const orderRes = await api.createOrder(orderData);
      console.log('Order response:', orderRes);
      
      const orderId = orderRes.orderId 
        || orderRes.insertId 
        || (orderRes.result && (orderRes.result.insertId || orderRes.result.orderId));
      
      if (!orderId) {
          throw new Error(`Nem sikerült lekérni a rendelés azonosítóját. Resp: ${JSON.stringify(orderRes)}`);
      }

      // 2. Invoice létrehozása (Invoices tábla)
      const invoiceRes = await api.createInvoice({
        base_amount: baseAmount,
        tip: tipAmount,
        total_amount: totalAmount,
        total_paid: totalAmount,
        payment_method: paymentMethod,
        billing_details: billingDetails || '',
        order_id: orderId
      });
      console.log('Invoice response:', invoiceRes);

      const invoiceId = invoiceRes.invoiceId 
        || invoiceRes.insertId 
        || (invoiceRes.result && invoiceRes.result.insertId);

      // 3. Rendelés frissítése: invoice_id = invoiceId
      await api.updateOrder(orderId, {
        status: 'pending',
        table_number: deskId,
        invoice_id: invoiceId || orderId
      });

      // 4. Rendelt tételek létrehozása (Ordered_items tábla)
      for (const item of cartItems) {
        let priceVal;
        if (typeof item.price === 'string') {
            priceVal = parseInt(item.price.replace(/\D/g, ''), 10) || 0;
        } else {
            priceVal = Number(item.price);
        }

        const orderedItemData = {
          order_id: orderId,
          product_id: item.id,
          quantity: item.quantity,
          current_price: priceVal,
          serving_status: 'pending'
        };
        console.log('Sending ordered item:', orderedItemData);
        await api.createOrderedItem(orderedItemData);
      }

      // 5. Kosár ürítése, oldalpanel bezárása
      clearCart();
      setPaymentMethod('Cash');
      setTip(0);
      setBillingDetails('');
      setSelectedDesk('');
      setCartOpen(false);
      alert('Rendelés sikeresen leadva!');
      
      
    } catch (err) {
      console.error(err);
      alert('Hiba történt a rendelés leadása közben.');
    } finally {
      setIsOrdering(false);
    }
  };

  const navItems = [
    { name: 'Étlap', path: '/menu' }
  ];

  if (!user) {
    navItems.push({ name: 'Bejelentkezés', path: '/login' });
  } else {
    if (user.name === 'admin') {
        navItems.push({ name: 'Asztalok', path: '/desks' });
        navItems.push({ name: 'Összes rendelés', path: '/orders' });
    } else {
        navItems.push({ name: 'Rendeléseim', path: '/orders' });
    }
  }

  return (
    <>
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)', pt: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', padding: '10px 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h4"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                fontFamily: 'serif',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'white',
                textDecoration: 'none',
                '&:hover': {
                  color: '#d4af37',
                }
              }}
            >
              LOGO
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
            {navItems.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'block',
                  fontFamily: 'sans-serif',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  '&:hover': {
                    color: '#d4af37',
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
            
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
                  Asztal: {user.name}
                </Typography>
                <Button 
                  onClick={logout}
                  sx={{ 
                    color: '#d4af37', 
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    '&:hover': {
                      border: '1px solid #d4af37',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)'
                    }
                  }}
                >
                  Kijelentkezés
                </Button>
              </Box>
            )}

            <IconButton color="inherit" onClick={() => setCartOpen(true)} sx={{ ml: 2, color: 'white', '&:hover': { color: '#d4af37' } }}>
               <Badge badgeContent={itemCount} color="error">
                 <ShoppingCartIcon />
               </Badge>
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton color="inherit" onClick={() => setCartOpen(true)} sx={{ mr: 2, color: 'white' }}>
               <Badge badgeContent={itemCount} color="error">
                 <ShoppingCartIcon />
               </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="menü"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobil Menü Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, backgroundColor: '#0a0a0a', color: 'white' },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'serif', color: '#d4af37', mb: 2, mt: 2 }}>
            42
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <Button component={Link} to={item.path} sx={{ width: '100%', py: 1.5, textAlign: 'center', color: 'white', '&:hover': { color: '#d4af37' } }}>
                  {item.name}
                </Button>
              </ListItem>
            ))}
            
            {user && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontSize: '0.9rem' }}>
                  {user.name} bejelentkezve
                </Typography>
                <Button 
                  onClick={logout}
                  sx={{ width: '100%', py: 1, color: '#d4af37' }}
                >
                  Kijelentkezés
                </Button>
              </Box>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>

    {/* Kosár Drawer */}
    <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { xs: '100%', sm: 400 }, backgroundColor: '#111', color: 'white', p: 3 },
        }}
    >
        <Typography variant="h5" sx={{ fontFamily: 'serif', mb: 3, color: '#d4af37', pt: 2 }}>
          Kosár tartalma
        </Typography>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        {cartItems.length === 0 ? (
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 5 }}>
            A kosarad jelenleg üres.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 3 }}>
              {cartItems.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px', marginRight: '16px' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#d4af37' }}>{item.price} x {item.quantity}</Typography>
                  </Box>
                  <IconButton onClick={() => removeFromCart(item.id)} sx={{ color: '#ff4444' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
              <Typography variant="h6" sx={{ fontFamily: 'serif' }}>Összesen:</Typography>
              <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>{calculateTotal()} Ft</Typography>
            </Box>

            {Number(tip) > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Borravalóval együtt:</Typography>
                <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 'bold' }}>{calculateTotal() + Number(tip)} Ft</Typography>
              </Box>
            )}

            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

            {(!user || user.name === 'admin') && (
              <FormControl fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' }, color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiSelect-icon': { color: 'white' } }}>
                <InputLabel id="desk-select-label">Asztal kiválasztása *</InputLabel>
                <Select
                  labelId="desk-select-label"
                  value={selectedDesk}
                  label="Asztal kiválasztása *"
                  onChange={(e) => setSelectedDesk(e.target.value)}
                  sx={{ '& .MuiSelect-select': { color: 'white' } }}
                >
                  {desks.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' }, color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiSelect-icon': { color: 'white' } }}>
              <InputLabel id="payment-method-label">Fizetési mód</InputLabel>
              <Select
                labelId="payment-method-label"
                value={paymentMethod}
                label="Fizetési mód"
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ '& .MuiSelect-select': { color: 'white' } }}
              >
                <MenuItem value="Cash">Készpénz</MenuItem>
                <MenuItem value="Card">Bankkártya</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Borravaló (Ft)"
              type="number"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              fullWidth
              inputProps={{ min: 0 }}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' }, color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& input': { color: 'white' } }}
            />

            <TextField
              label="Számlázási adatok (opcionális)"
              value={billingDetails}
              onChange={(e) => setBillingDetails(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' }, color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& textarea': { color: 'white' } }}
            />

            <Button
              variant="contained"
              onClick={handleCheckout}
              disabled={isOrdering || (!selectedDesk && (!user || user.name === 'admin'))}
              sx={{ backgroundColor: '#d4af37', color: 'black', fontWeight: 'bold', width: '100%', py: 1.5, '&:hover': { backgroundColor: '#b5952f' }, '&.Mui-disabled': { backgroundColor: 'rgba(212, 175, 55, 0.3)', color: 'rgba(255,255,255,0.3)' } }}
            >
              {isOrdering ? <CircularProgress size={24} color="inherit" /> : `Rendelés leadása (${calculateTotal() + Number(tip || 0)} Ft)`}
            </Button>
          </Box>
        )}
    </Drawer>
    </>
  );
}
