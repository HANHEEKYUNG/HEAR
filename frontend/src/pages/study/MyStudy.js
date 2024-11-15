import React, { useMemo }from 'react';
import { Typography, Box, Grid, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import Footer from '../../components/Footer';

import useMenuShortcut from "../../hooks/useMenuShortcut";
import CommentIcon from '@mui/icons-material/Comment';
import { FaPrayingHands } from "react-icons/fa";
import HistoryIcon from '@mui/icons-material/History';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const MyStudy = () => {
  const navigate = useNavigate();

  const menuItems = useMemo(
    () => [
      {
        icon: <HistoryIcon fontSize="inherit" sx={{ color: "#7779FF" }} />,
        label: "21. 최근 읽은 기록",
        path: "/mystudy/history",
      },
      {
        icon: <StarOutlineIcon fontSize="inherit" sx={{ color: "#77DAFF" }} />,
        label: "22. 하이라이트",
        path: "/mystudy/highlight",
      },
      {
        icon: <CommentIcon fontSize="inherit" sx={{ color: "#77AAFF" }} />,
        label: "23. 독서노트",
        path: "/mystudy/mybookreport",
      },
      {
        icon: <FaPrayingHands fontSize="inherit" color= "#77BAFF" />,
        label: "24. 희망도서신청조회",
        path: "/mystudy/mywishbook",
      },
    ],
    []
  );

  useMenuShortcut({
    1: () => navigate(menuItems[0].path),
    2: () => navigate(menuItems[1].path),
    3: () => navigate(menuItems[2].path),
    4: () => navigate(menuItems[3].path),
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
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {menuItems.map(({ icon, label, path }, index) => (
              <Grid item xs={6} sm={4} md={5} key={index}>
                <Card
                  onClick={() => navigate(path)}
                  sx={{
                    height: 250,
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

export default MyStudy;