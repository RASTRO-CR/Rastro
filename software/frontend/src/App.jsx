import React from 'react';
import RunnerMap from './components/RunnerMap';
import { AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Monitoreo de Corredores
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <RunnerMap />
      </Container>
    </>
  );
}

export default App;