import React, { useMemo }from 'react';
import { Typography, Box, Grid, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

import useMenuShortcut from "../../hooks/useMenuShortcut";
import HeadsetIcon from '@mui/icons-material/Headset';
import PersonIcon from '@mui/icons-material/Person';
import MicIcon from '@mui/icons-material/Mic';


const Setting = () => {
  const navigate = useNavigate();

  const menuItems = useMemo(
    () => [
      {
        icon: <MicIcon fontSize="inherit" sx={{ color: "#FF77D8" }} />,
        label: "31. 목소리 녹음",
        path: "/setting/voice" ,
      },
      {
        icon: <HeadsetIcon fontSize="inherit" sx={{ color: "#FF7777" }} />,
        label: "32. 오디오북 설정",
        path: "/setting/audio",
      },
      {
        icon: <PersonIcon fontSize="inherit" sx={{ color: "#FF77A8" }} />,
        label: "33. 회원정보수정",
        path: "/setting/user",
      },
    ],
    []
  );

  useMenuShortcut({
    1: () => navigate(menuItems[0].path),
    2: () => navigate(menuItems[1].path),
    3: () => navigate(menuItems[2].path),
  });

  
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: "#FFFFFF",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container maxWidth="lg"> 
          <Grid container spacing={6} justifyContent="center"   alignItems="center">
            {menuItems.map(({ icon, label, path }, index) => (
              <Grid item xs={6} sm={4} md={4} key={index}>
                <Card
                  onClick={() => navigate(path)}
                  sx={{
                    height: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "#F7FAFF ",
                    "&:hover": { boxShadow: 10 },
                    padding: 3,
                    borderRadius: 20
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ fontSize: 150 }}>{icon}</Box>
                    <Typography variant="h6" sx={{ mt:-8 }}>
                      {label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
      </Box>
  );
};

export default Setting;
