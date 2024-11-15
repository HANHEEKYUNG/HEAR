import React, { useState, useEffect, useMemo } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import {
  Box,
  Card,
  CardContent,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableRow,
  Pagination,
  PaginationItem,
  Button,
  Menu,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { fetchLibrary } from "../../api/libraryAPI";
import usePagination from "../../hooks/usePagination";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ImportContacts,
  Article,
  Create,
  Share,
  FilterList,
} from "@mui/icons-material";

const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookList, setBookList] = useState([]);
  const [filteredBookList, setFilteredBookList] = useState([]);
  const rowsPerPage = 6;
  const [category, setCategory] = useState(location.state?.category || null);
  const [book, setBook] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]); // 초기에는 빈 배열로 설정

  const filterCategories = useMemo(() => ["건강", "기타", "먹거리", "여행", "인터뷰", "해설"], []);
  const filterValues = useMemo(() => ["410", "420", "430", "440", "450", "460"], []);

  const { currentData, totalPages, page, handlePageChange, setPage } = usePagination(
    filteredBookList.length > 0 ? filteredBookList : bookList,
    rowsPerPage
  );

  useEffect(() => {
    // filterValues가 초기화된 후 selectedFilters를 설정
    setSelectedFilters(filterValues);
  }, [filterValues]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLibrary();
        // response의 CATEGORY 값을 filterValues와 매핑하여 CATEGORY_LABEL 생성
        const mappedResponse = response.map((book) => {
          const categoryIndex = filterValues.indexOf(book.CATEGORY);
          const categoryLabel = categoryIndex !== -1 ? filterCategories[categoryIndex] : "기타";
          return { ...book, CATEGORY_LABEL: categoryLabel };
        });

        setBookList(mappedResponse);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);
      }
    };
    fetchData();
  }, [filterCategories, filterValues]);

  useEffect(() => {
    let filteredBooks = bookList;
    console.log('selectedFilters 초기 상태:', selectedFilters);
  
    if (!category) {
      // 상태가 다를 때만 업데이트
      if (filteredBookList.length !== bookList.length) {
        setFilteredBookList(bookList);
      }
      return;
    }
  
    if (category) {
      if (category === "400") {
        filteredBooks = filteredBooks.filter((book) =>
          filterValues.includes(book.CATEGORY)
        );
  
        if (selectedFilters.length > 0) {
          filteredBooks = filteredBooks.filter((book) =>
            selectedFilters.includes(String(book.CATEGORY))
          );
        }
      } else {
        filteredBooks = filteredBooks.filter(
          (book) => book.CATEGORY === category
        );
      }
    }
  
    // 상태가 다를 때만 업데이트
    if (JSON.stringify(filteredBooks) !== JSON.stringify(filteredBookList)) {
      setFilteredBookList(filteredBooks);
    }
  }, [category, selectedFilters, bookList, filterValues, filteredBookList]);

  const handleCategoryClick = (newCategory) => {
    setCategory(newCategory);
    setPage(1); // 카테고리 변경 시 페이지를 1로 초기화

    // 필요에 따라 초기화할지 결정
    if (newCategory !== "400") {
      setSelectedFilters([]); // 이 줄을 필요에 따라 삭제 또는 수정
    } else {
      setSelectedFilters(filterValues); // 공유세상일 때 기본값 유지
    }
  };

  const handleBook = (book) => {
    setBook(book.BOOK_SEQ);
    navigate(`/library/book/`, { state: { selected: book.BOOK_SEQ, category } });
  };

  const handleKeyPress = (event, book) => {
    if (event.key === "Enter" || event.key === " ") {
      setBook(book.BOOK_SEQ);
      handleBook(book);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked
        ? [...prevFilters, value]
        : prevFilters.filter((filter) => filter !== value)
    );
  };

  const cardStyle = (selectedCategory, currentCategory) => ({
    width: 200,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    boxShadow: 3,
    cursor: "pointer",
    transition: "0.3s",
    bgcolor: selectedCategory === currentCategory ? "#246624" : "#DCEEDC",
    color: selectedCategory === currentCategory ? "#ffffff" : "inherit",
    "&:hover": {
      boxShadow: 6,
    },
  });

  // 전체보기 버튼 클릭 핸들러 추가
  const handleShowAllClick = () => {
    setCategory(null); // 카테고리를 초기화
    setSelectedFilters(filterValues); // 모든 필터 선택 해제
    setPage(1); // 페이지를 첫 페이지로 초기화
  };

  const checkboxStyle = {
    color: "#246624",
    "&.Mui-checked": {
      color: "#246624",
    },
    "&:hover": {
      bgcolor: "transparent",
    },
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
      <Breadcrumb selected={book} />

      <Box
        bgcolor="#f7f7f7"
        py={4}
        display="flex"
        justifyContent="center"
        gap={10}
      >
        <Card
          sx={cardStyle(category, null)} // 선택되지 않은 상태를 위해 null 사용
          onClick={handleShowAllClick}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              전체보기
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={cardStyle(category, "200")}
          onClick={() => handleCategoryClick("200")}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ImportContacts
                fontSize="large"
                sx={{
                  marginTop: "5px",
                  color: category === "200" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                시
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle(category, "100")}
          onClick={() => handleCategoryClick("100")}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Article
                fontSize="large"
                sx={{
                  marginTop: "5px",
                  color: category === "100" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                소설
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle(category, "300")}
          onClick={() => handleCategoryClick("300")}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Create
                fontSize="large"
                sx={{
                  marginTop: "5px",
                  color: category === "300" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                수필
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle(category, "400")}
          onClick={() => handleCategoryClick("400")}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Share
                fontSize="large"
                sx={{
                  marginTop: "5px",
                  color: category === "400" ? "#ffffff" : "#246624",
                }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                공유세상
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card
        sx={{
          maxWidth: "75%",
          margin: "auto",
          mt: 4,
          p: 4,
          bgcolor: '#F8FBF8 ',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom textAlign="center" sx={{fontSize: "36px", mb: 2 }}>
          {category === "400" ? "공유세상" : "도서마당"}
        </Typography>
        {category === "400" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleMenuOpen}
              sx={{
                color: "#246624",
                borderColor: "#246624",
                "&:hover": {
                  bgcolor: "#246624",
                  color: "#ffffff",
                  borderColor: "#246624",
                },
              }}
            >
              필터
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem>
                <FormGroup>
                  {filterCategories.map((label, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          id={`checkbox-${filterValues[index]}`} // id 추가
                          name={`checkbox-${filterValues[index]}`} // name 추가
                          value={filterValues[index]}
                          checked={selectedFilters.includes(filterValues[index])} // 현재 상태 반영
                          sx={checkboxStyle}
                          onChange={handleFilterChange}
                        />
                      }
                      label={label}
                    />
                  ))}
                </FormGroup>
              </MenuItem>
            </Menu>
          </Box>
        )}
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflow: "auto" }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: "40%", fontSize: 18, fontWeight: 'bold' }}>
                  {category === "400" ? "방송 제목" : "책 제목"}
                </TableCell>
                {category === "400" && (
                  <TableCell align="center" sx={{ width: "20%", fontSize: 18, fontWeight: 'bold' }}>
                    분류
                  </TableCell>
                )}
                <TableCell align="center" sx={{ width: "20%", fontSize: 18, fontWeight: 'bold'}}>
                  작가
                </TableCell>
                <TableCell align="center" sx={{ width: "20%", fontSize: 18, fontWeight: 'bold' }}>
                  전체 재생 시간
                </TableCell>
                <TableCell align="center" sx={{ width: "20%", fontSize: 18, fontWeight: 'bold' }}>
                  요약 재생 시간
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((book, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      setBook === book.index ? "#e0f7fa" : "inherit",
                    "&:hover": {
                      backgroundColor: "#DCEEDC",
                      cursor: "pointer",
                    },
                    "&:focus": { backgroundColor: "#DCEEDC" },
                  }}
                  onClick={() => handleBook(book)}
                  onKeyPress={(event) => handleKeyPress(event, book)}
                  tabIndex={0}
                >
                  <TableCell component="th" scope="row" align="center">
                    {book.BOOK_NAME}
                  </TableCell>
                  {category === "400" && (
                    <TableCell align="center">{book.CATEGORY_LABEL}</TableCell>
                  )}
                  <TableCell align="center">{book.AUTHOR}</TableCell>
                  <TableCell align="center">{book.RUN_TIME}</TableCell>
                  <TableCell align="center">{book.SUM_TIME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#246624",
                    color: "#ffffff",
                  },
                  "&:hover": {
                    bgcolor: "#246624",
                    color: "#ffffff",
                  },
                }}
              />
            )}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Library;
