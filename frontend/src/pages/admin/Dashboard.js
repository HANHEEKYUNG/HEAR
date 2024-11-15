import React from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Grid, Paper, Toolbar } from '@mui/material';
import CustomAppBar from './components/CustomAppBar';
import DrawerComponent from './components/DrawerComponent';
import { useDrawer } from './context/DrawerContext';
import Copyright from './components/Copyright';
import theme from '../../theme';

// 차트 컴포넌트 및 표 컴포넌트 임포트
import CategoryChart from './pages/Dashboard/CategoryChart';
import DailySignUpChart from './pages/Dashboard/DailySignUpChart';
import RecentNotices from './pages/Dashboard/RecentNotices';
import RecentUploadHistory from './pages/Dashboard/RecentUploadHistory';
import UserReadingRank from './pages/Dashboard/UserReadingRank';

export default function Dashboard() {
  const { open, toggleDrawer } = useDrawer();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <CustomAppBar open={open} toggleDrawer={toggleDrawer} />
        <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            background: "linear-gradient(180deg, #FFE0B2, #FFFFFF)",
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 3, mb: 3, }}>
            <Paper sx={{ p: 4 , py: 5, boxShadow: 10, background: "linear-gradient(180deg, #FFFFFF, #FAF0E6)" }}>
              {/* 상단 차트 */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CategoryChart />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DailySignUpChart />
                </Grid>
              </Grid>

              {/* 하단 표 3개 */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={4}>
                  <RecentNotices />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RecentUploadHistory />
                </Grid>
                <Grid item xs={12} md={4}>
                  <UserReadingRank />
                </Grid>
              </Grid>
            </Paper>

            <Copyright sx={{ pt: 2, mt: 5 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
