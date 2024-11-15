import React from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer as MuiDrawer,
  List,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Rule as RuleIcon,
  Upload as PublishIcon,
  EditNotifications as EditNotificationsIcon,
  LibraryBooks as LibraryBooksIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    background: "rgb(237, 237, 237)",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function DrawerComponent({ open, toggleDrawer }) {
  const navigate = useNavigate();

  const menuItems = [
    { text: "대시보드", icon: <DashboardIcon sx={{ml:1}} />, path: "/dashboard" },
    { text: "공유마당", icon: <PublishIcon sx={{ml:1}}/>, path: "/admin/predict" },
    { text: "도서관리", icon: <LibraryBooksIcon sx={{ml:1}}/>, path: "/admin/booklist" },
    { text: "희망도서신청승인", icon: <RuleIcon sx={{ml:1}}/>, path: "/admin/approval" },
    { text: "공지사항 관리", icon: <EditNotificationsIcon sx={{ml:1}}/>, path: "/admin/noticelist" },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
          mb: -1,
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <List component="nav">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItemButton onClick={() => navigate(item.path)} sx={{ mt: 2, mb: 2 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
            {index < menuItems.length - 1 && <Divider />} {/* 마지막 항목 아래에는 Divider를 추가하지 않음 */}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
