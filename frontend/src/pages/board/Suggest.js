// Suggest.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, InputBase, Card, CardContent, Container, PaginationItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import { fetchSuggests } from '../../api/boardAPI';
import usePagination from '../../hooks/usePagination';
import { formatInTimeZone } from 'date-fns-tz';

const Suggest = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentData, totalPages, page, handlePageChange } = usePagination(filteredData, 10);
  const [ notice, setNotice ] = useState();

  useEffect(() => {
    const getSuggests = async () => {
      try {
        const suggests = await fetchSuggests();
        const sortedSuggests = suggests.sort((a, b) => new Date(b.NOTICE_CrtDt) - new Date(a.NOTICE_CrtDt));
        
        setData(sortedSuggests);
        setFilteredData(sortedSuggests);
      } catch (error) {
        console.error("Failed to fetch suggests:", error);
      }
    };
    getSuggests();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    
    const filtered = data.filter((suggest) => 
      suggest.NOTICE_TITLE.includes(searchTerm) ||  
      suggest.NICKNAME.includes(searchTerm)
    );
    
    setFilteredData(filtered);
  };

  // 게시글을 클릭했을 때 해당 게시글을 선택하는 함수
  const handleClick = (row) => {
    console.log("row 확인", row.NOTICE_SEQ);
    
    setNotice(row)
    navigate(`/board/suggest/suggestDetail`, { state: { selected: row.NOTICE_SEQ } });
  };


  const handleKeyPress = (event, row) => {
    if (event.key === "Enter" || event.key === " ") {
      setNotice(row)
      handleClick(notice);
    }
  };
  

  return (
    <Box
    bgcolor="#FFFEFE"
    sx={{
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
      <Header />
      <Breadcrumb />
      <ProfileSection />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, marginTop: '0px' }} >
      <Card sx={{ width: 1200, margin: 'auto', mt: 5, p: 12, mb: 10, borderRadius: 5, boxShadow: 10, display: "flex", alignItems: "center", bgcolor: '#ffe0b2',
          justifyContent: "center"}}
        >
          <CardContent>
        <Typography variant="h6" align="center" sx={{fontSize: "36px", marginTop: '-70px'}} gutterBottom>건의사항</Typography>

        {/* Search and "게시글 작성" Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6, mb: 2 }}>
          <Paper component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', width: 400 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button variant="contained" color="primary" sx={{fontSize: "18px", fontWeight: 'bold',}} onClick={() => navigate("/board/suggest/suggestWrite")}>
            게시글 작성
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflow: 'auto', mt: 3 }}>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
              <TableCell align="center" sx={{  fontSize: "18px", fontWeight: 'bold',width: '10%' }}>번호</TableCell>
                <TableCell align="center" sx={{ fontSize: "18px", fontWeight: 'bold',width: '50%' }}>제목</TableCell>
                <TableCell align="center" sx={{ fontSize: "18px", fontWeight: 'bold',width: '20%' }}>작성일</TableCell>
                <TableCell align="center" sx={{ fontSize: "18px", fontWeight: 'bold',width: '20%' }}>작성자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#FFB74D', cursor: 'pointer' } }}  
                onClick={() => handleClick(row)}
                onKeyPress={(event) => handleKeyPress(event, row)}>
                  <TableCell align="center">{row.NOTICE_SEQ}</TableCell>
                  <TableCell align="center">{row.NOTICE_TITLE}</TableCell>
                  <TableCell align="center">{formatInTimeZone(new Date(row.NOTICE_CrtDt), 'UTC', 'yyyy.MM.dd')}</TableCell>
                  <TableCell align="center">{row.NICKNAME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: -10 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#FFB74D",
                    color: "#ffffff",
                  },
                  "&:hover": {
                    bgcolor: "#FFB74D",
                    color: "#ffffff",
                  },
                }}
              />
            )}
          />
        </Box>
        </CardContent>
      </Card>
      </Container>
    </Box>
  );
};

export default Suggest;
