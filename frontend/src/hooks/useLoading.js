import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const useLoading = (loadingMessage = "로딩 중...") => {
  const [isLoading, setIsLoading] = useState(false);

  const LoadingIndicator = () => (
    <Box display="flex" justifyContent="center" alignItems="center" my={4}>
      <CircularProgress />
      <Typography variant="body1" sx={{ ml: 2 }}>{loadingMessage}</Typography>
    </Box>
  );

  return { isLoading, setIsLoading, LoadingIndicator };
};

export default useLoading;
