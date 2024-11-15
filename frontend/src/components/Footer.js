import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box py={2} textAlign="center" bgcolor={"#101E2D"} >
      <Typography variant="body4">
        {'주소: 61740 광주 남구 송암로 60 광주CGI센터 2층 \n'}
      </Typography>
      <Typography variant="body4">
        {'TEL: 062-655-3506 / FAX: 062-987-6543 \n'}
      </Typography>
      <Typography variant="body4">
        © Copyright 2024 Hear. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;