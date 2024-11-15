import React, { useMemo }from 'react';
import { Typography, Box, Grid, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from '@mui/icons-material/Mail';
import { FaPrayingHands } from "react-icons/fa";

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

import useMenuShortcut from "../../hooks/useMenuShortcut";

const Board = () => {
  const navigate = useNavigate();

  const menuItems = useMemo(
    () => [
      {
        icon: <NotificationsIcon fontSize="inherit" sx={{ color: "#FFE347" }} />,
        label: "41. 공지사항",
        path: "/board/notice",
      },
      {
        icon: <MailIcon fontSize="inherit" sx={{ color: "#FFAF41" }} />,
        label: "42. 건의사항",
        path: "/board/suggest",
      },
      {
        icon: <FaPrayingHands style={{ color: "#ffcf8e" }} />,
        label: "43. 희망도서신청",
        path: "/board/wishbook",
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
          <Grid container spacing={6} justifyContent="center" alignItems="center">
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
    // </div>
  );
};

export default Board;
