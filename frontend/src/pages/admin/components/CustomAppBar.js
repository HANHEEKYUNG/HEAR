import React, { useState } from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, Badge, styled, Box, Menu, MenuItem, Typography } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Logout as LogoutIcon, DoneAll as DoneAllIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import logo from '../assets/logo1.png';
import { formatNotificationMessage, getNotificationPath } from '../utils/notificationUtils';
import { usePolling } from '../hooks/usePolling';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../api/notificationApi';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function CustomAppBar({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const { setUserObject } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  usePolling(setNotifications);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUserObject(null);
    navigate("/");
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationRead = async (notification) => {
    try {
      await markNotificationAsRead(notification.NOTI_SEQ);
      setNotifications(prev => prev.filter(notif => notif.NOTI_SEQ !== notification.NOTI_SEQ));
      handleClose();
      const path = getNotificationPath(notification);
      navigate(path);
    } catch (error) {
      console.error('Failed to process notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications([]);
      handleClose();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar sx={{ pr: '24px' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box component="img" src={logo} alt="Logo" sx={{ height: 40, marginRight: 'auto' }} />

        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {notifications.length > 0 ? [
              // 모든 알림 읽음 처리 버튼
              <MenuItem 
                key="mark-all-read"
                onClick={handleMarkAllAsRead}
                sx={{ 
                  borderBottom: '1px solid #eee',
                  color: '#246624',
                  '&:hover': {
                    backgroundColor: '#DCEEDC',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DoneAllIcon fontSize="small" />
                  <Typography variant="body2">모든 알림 읽음 처리</Typography>
                </Box>
              </MenuItem>,
              
              // 알림 목록
              ...notifications.map((notification) => (
                <MenuItem 
                  key={notification.NOTI_SEQ}
                  onClick={() => handleNotificationRead(notification)}
                >
                  <Typography variant="body2">
                    {formatNotificationMessage(notification)}
                  </Typography>
                </MenuItem>
              ))
            ] : [
              <MenuItem key="no-notifications" onClick={handleClose}>
                <Typography variant="body2">새로운 알림이 없습니다</Typography>
              </MenuItem>
            ]}
          </Menu>

        <IconButton color="inherit" onClick={handleLogout} sx={{ marginLeft: '16px' }}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}