import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Snackbar 열기 함수
  const openSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Snackbar 컴포넌트
  const SnackbarComponent = () => (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={2000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );

  return { openSnackbar, SnackbarComponent };
};

export default useSnackbar;
