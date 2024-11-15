// Copyright.js
import React from 'react';
import { Typography, Link } from '@mui/material';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://jtothemoon87.notion.site/10a95f91db4c8141986fe52b92c10807?v=fff95f91db4c81438251000cd300f383">
        H-EAR
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
