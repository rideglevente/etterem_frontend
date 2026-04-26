import React from 'react';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const awards = [
  {
    icon: <StarIcon sx={{ fontSize: 60, color: '#d4af37', mb: 2 }} />,
    title: 'Michelin Csillag',
    description: 'A legkiválóbb élményért (2022, 2023, 2024)',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 60, color: '#d4af37', mb: 2 }} />,
    title: 'Gault & Millau',
    description: 'Kiemelkedő 18.5 pontos értékelés',
  },
  {
    icon: <RestaurantIcon sx={{ fontSize: 60, color: '#d4af37', mb: 2 }} />,
    title: 'Dining Guide',
    description: 'Az Év Innovatív Étterme (2023)',
  }
];

export default function AwardsSection() {
  return (
    <Box sx={{ py: 10, backgroundColor: '#111111', color: 'white', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: 'serif', textAlign: 'center', mb: 8 }}>
          Szakmai Elismerések
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {awards.map((award, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Stack alignItems="center" textAlign="center" sx={{ px: 2 }}>
                {award.icon}
                <Typography variant="h5" sx={{ fontFamily: 'serif', mb: 1, fontWeight: 'bold' }}>
                  {award.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {award.description}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
