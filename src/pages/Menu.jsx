import React, { useState, useContext } from 'react';
import { Box, Typography, Container, Card, CardMedia, CardContent, Dialog, DialogContent, IconButton, Button, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CartContext } from '../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../api';

const svgs = { 
  [3]: "/eloetelok_etlap.svg",
  [4]: "/levesek_etlap.svg",
  [5]: "/foetelek_etlap.svg",
  [6]: "/desszertek_etlap.svg",
  [7]: "alkoholmentes_italok_etlap.svg",
  [8]: "kavek_teak_etlap.svg",
  [9]: "borok_pezsgok_etlap.svg",
  [10]: "sorok_etlap.svg",
  [11]: "egetett_szeszek_koktelok_etlap.svg",
}

export default function Menu() {
  const { addToCart } = useContext(CartContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [categories, products] = await Promise.all([
          api.getCategories(),
          api.getProducts()
        ]);
        
        const formattedData = categories.map(cat => ({
          category: cat.name,
          categoryId: cat.id, 
          items: products
            .filter(p => Number(p.category_id) === Number(cat.id) && p.is_available !== 0 && p.is_available !== false)
            .map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description || p.story_text || p.chef_note || 'Kiváló minőségű fogás éttermünkből.',
              price: `${p.price} Ft`,
            }))
        })).filter(cat => cat.items.length > 0);
        
        setMenuData(formattedData);
      } catch (error) {
        console.error('Cannot load menu from backend:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, []);

   const handleOpen = (item) => {

    setSelectedItem(item);

    setOpen(true);

  };



  const handleClose = () => {

    setOpen(false);

  };



  const handleAddToCart = () => {

    if (selectedItem) {

      addToCart({

        id: selectedItem.id,

        name: selectedItem.name,

        price: selectedItem.price,

        image: selectedItem.image

      });

      setSnackbarOpen(true);

      handleClose();

    }

  };

  return (
    <Box sx={{ pt: 15, pb: 10, minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'serif', textAlign: 'center', mb: 8, color: '#d4af37' }}>
          Étlapunk
        </Typography>

        {menuData.map((section, index) => (
          <Box key={index} sx={{ mb: 12 }}>
            {/* Kategória címe */}
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: 'serif', 
                mb: 2, 
                pl: 2, 
                borderLeft: '4px solid #d4af37',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}
            >
              {section.category}
            </Typography>

            {/* Kategória nagy képe/ikonja */}
            {svgs[section.categoryId] && (
              <Box 
                sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 6,
                  mt: 2,
                  // Egy kis mélységet adunk neki árnyékkal és effekttel
                  filter: 'drop-shadow(0px 10px 15px rgba(212, 175, 55, 0.2))'
                }}
              >
                <Box 
                  component="img"
                  src={svgs[section.categoryId]}
                  alt={section.category}
                  sx={{ 
                    height: { xs: '250px', md: '500px' }, // Mobilon kisebb, asztalin nagyobb
                    width: 'auto',
                    maxWidth: '90%',
                    objectFit: 'contain',
                    opacity: 0.9,
                    // Ez a filter teszi az SVG-t elegáns arany színűvé
                    filter: 'invert(82%) sepia(21%) saturate(1034%) hue-rotate(359deg) brightness(93%) contrast(89%)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Box>
            )}

            {/* Swiper / Termékek */}
            <Box sx={{ '.swiper-button-next, .swiper-button-prev': { color: '#d4af37' }, '.swiper-pagination-bullet-active': { backgroundColor: '#d4af37' } }}>
<Swiper

                modules={[Navigation, Pagination, Autoplay]}

                navigation

                pagination={{ clickable: true }}

                autoplay={{ delay: 3500 + index * 500, disableOnInteraction: false, pauseOnMouseEnter: true }}

                spaceBetween={40}

                slidesPerView={3}

                breakpoints={{

                  640: { slidesPerView: 2 },

                  960: { slidesPerView: 3 },

                  1280: { slidesPerView: 4 },

                }}

                style={{ paddingBottom: '50px', paddingLeft: '10px', paddingRight: '10px' }}

              >

                {section.items.map((item, idx) => (

                  <SwiperSlide key={idx} style={{ height: 'auto' }}>

                    <Card

                      onClick={() => handleOpen(item)}

                      sx={{

                        backgroundColor: '#111111',

                        color: 'white',

                        border: '1px solid rgba(255,255,255,0.05)',

                        borderRadius: '8px',

                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',

                        height: '100%',

                        display: 'flex',

                        flexDirection: 'column',

                        cursor: 'pointer',

                        transition: 'transform 0.2s',

                        '&:hover': { transform: 'scale(1.02)' }

                      }}

                    >

                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

                        <Typography gutterBottom variant="h6" component="div" sx={{ fontFamily: 'serif', fontWeight: 'bold' }}>

                          {item.name}

                        </Typography>

                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, flexGrow: 1 }}>

                          {item.description}

                        </Typography>

                        <Typography variant="h6" sx={{ color: '#d4af37', fontFamily: 'serif' }}>

                          {item.price}

                        </Typography>

                      </CardContent>

                    </Card>

                  </SwiperSlide>

                ))}

              </Swiper>
            </Box>
          </Box>
        ))}
      </Container>
      
 {/* Modal / Dialog a részletekhez */}

      <Dialog

        open={open}

        onClose={handleClose}

        maxWidth="sm"

        fullWidth

        PaperProps={{

          style: {

            backgroundColor: '#1a1a1a',

            color: 'white',

            borderRadius: '12px',

          }

        }}

      >

        {selectedItem && (

          <>

            <Box sx={{ position: 'relative' }}>

              <IconButton

                aria-label="close"

                onClick={handleClose}

                sx={{

                  position: 'absolute',

                  right: 8,

                  top: 8,

                  color: 'white',

                  backgroundColor: 'rgba(0,0,0,0.5)',

                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }

                }}

              >

                <CloseIcon />

              </IconButton>

            </Box>

            <DialogContent sx={{ p: 4 }}>

              <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 2, color: '#d4af37' }}>

                {selectedItem.name}

              </Typography>

              <Typography variant="h6" sx={{ mb: 3 }}>

                {selectedItem.price}

              </Typography>

              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.8 }}>

                {selectedItem.description}

              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 4 }}>

                * Allergénekkel vagy egyedi nyersanyag-allergiával kapcsolatban kérjük tájékoztasd

                rendelés előtt a felszolgálót.

              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>

                {selectedItem.allergens && `Allergének: ${selectedItem.allergens.join(', ')}`}

              </Typography>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>

                <Button

                   variant="contained"

                   onClick={handleAddToCart}

                   sx={{ backgroundColor: '#d4af37', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#b5952f' }, width: '100%', py: 1.5 }}

                >

                   Kosárba teszem

                </Button>

              </Box>

            </DialogContent>

          </>

        )}

      </Dialog>



      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>

        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', '& .MuiAlert-icon': { color: '#4caf50' } }}>

          A terméket hozzáadtuk a kosárhoz!

        </Alert>

      </Snackbar>

    </Box>
  );
}
