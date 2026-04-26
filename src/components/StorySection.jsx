import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

export default function StorySection() {
  return (
    <Box sx={{ py: 12, backgroundColor: '#0a0a0a', color: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h6" sx={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '2px', mb: 2 }}>
                A kezdetek
              </Typography>
              <Typography variant="h3" sx={{ fontFamily: 'serif', mb: 4, lineHeight: 1.2 }}>
                Egy álom, ami <br />valóság lett
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, lineHeight: 1.8 }}>
                A 42 Restaurant története nem csupán a gasztronómia szeretetéről szól, hanem a hagyományok és az innováció tökéletes harmóniájáról. Szabó Kevin executive chef és Varga Sándor alapító víziója az volt, hogy egy olyan helyet teremtsenek, ahol a hazai alapanyagok tisztelete nemzetközi látásmóddal és csúcstechnológiával találkozik.
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8 }}>
                Útunk során folyamatosan kerestük a legtisztább, legőszintébb ízeket. Minden tányér egy újabb fejezet a történetünkben, ami ötvözi az emlékeket, a világkörüli utazásaink inspirációit és a magyar tradíciókat. Lépj be a világunkba, és tapasztald meg te is!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1920&auto=format&fit=crop"
              alt="42 Restaurant Interior"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
