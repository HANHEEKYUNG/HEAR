import React, { useMemo } from "react";
import { Typography, Box, Grid, Card, CardContent, Container } from "@mui/material";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { IoLibrary } from "react-icons/io5";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import useMenuShortcut from "../hooks/useMenuShortcut";

const Menu = () => {
  const navigate = useNavigate();

  const menuItems = useMemo(
    () => [
      {
        icon: <LibraryMusicIcon fontSize="inherit" sx={{ color: "#90EE90" }} />,
        label: "1. 도서마당",
        path: "/library",
      },
      {
        icon: <IoLibrary fontSize="inherit" color="#77AAFF" />,
        label: "2. 내 서재",
        path: "/mystudy",
      },
      {
        icon: <SettingsIcon fontSize="inherit" sx={{ color: "#FF77A8" }} />,
        label: "3. 설정",
        path: "/setting",
      },
      {
        icon: <SupportAgentIcon fontSize="inherit" sx={{ color: "#FFCF8B" }} />,
        label: "4. 고객게시판",
        path: "/board",
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
              <Grid item xs={12} sm={6} md={6} key={index}>
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
                    <Box sx={{ fontSize: 200 }}>{icon}</Box>
                    <Typography variant="h6" sx={{ mt:-10 }}>
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

export default Menu;