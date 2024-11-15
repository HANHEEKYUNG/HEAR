import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import { fetchLibrary, getLastPosition } from "../../api/libraryAPI";
import { useNavigate, useLocation } from "react-router-dom";
import useOpenAISummary from "../../hooks/useOpenAISummary";
import useElevenLabsTTS from "../../hooks/useElevenLabsTTS";
import { ImportContacts, Article, Create, Share } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import useLoading from "../../hooks/useLoading";

const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState([]);
  const { saveTTSFile } = useElevenLabsTTS();
  const { getSummary, isLoading: summaryLoading } = useOpenAISummary();
  const { userObject } = useAuth();
  const [lastPosition, setLastPosition] = useState(0);
  const [hasHistory, setHasHistory] = useState(false);
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading();
  const selectedBook = location.state.selected;

  const category = location.state?.category || null; // category 추출

  useEffect(() => {
    const fetchBookData = async () => {
      if (selectedBook) {
        try {
          const response = await fetchLibrary();
          console.log("response", response);

          const bookData = response.find(
            (b) => b.BOOK_SEQ === Number(selectedBook)
          );
          if (bookData) {
            setBook(bookData);
            const position = await getLastPosition(
              selectedBook,
              userObject?.USER_SEQ
            );
            if (position > 0) {
              setLastPosition(position);
              setHasHistory(true);
            } else {
              setHasHistory(false);
            }
          } else {
            console.error("해당 책을 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("책 데이터를 불러오는 중 오류가 발생했습니다.", error);
        }
      }
    };
    fetchBookData();
  }, [selectedBook, userObject?.USER_SEQ]);

  const handleAISummary = async () => {
    if (userObject) {
      setIsLoading(true); // 로딩 시작
      try {
        const summary = await getSummary(book.BOOK_TEXT);
        await saveTTSFile(userObject.EL_ID, summary, book.BOOK_SEQ, true);
        navigate("/library/book/aisummary", {
          state: { selected: book.BOOK_SEQ },
        });
      } catch (error) {
        console.error("AI 요약 파일 생성 중 오류 발생:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    }
  };

  const handleListenFromStart = async () => {
    setIsLoading(true); // 로딩 시작
    if (userObject) {
      try {
        await saveTTSFile(
          userObject.EL_ID,
          book.BOOK_TEXT,
          book.BOOK_SEQ,
          false
        );
        navigate(`/library/book/play`, {
          state: { lastPosition: 0, selected: book.BOOK_SEQ },
        });
      } catch (error) {
        console.error("파일 생성 중 오류 발생:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    }
  };

  const handleContinueListening = async () => {
    setIsLoading(true); // 로딩 시작
    if (userObject) {
      try {
        await saveTTSFile(
          userObject.EL_ID,
          book.BOOK_TEXT,
          book.BOOK_SEQ,
          false
        );
        navigate(`/library/book/play`, {
          state: { lastPosition, selected: book.BOOK_SEQ },
        });
      } catch (error) {
        console.error("파일 생성 중 오류 발생:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    }
  };

  const cardStyle = {
    width: 200,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#DCEEDC",
    borderRadius: 10,
    boxShadow: 3,
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      boxShadow: 6,
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
      <Breadcrumb />

      {/* 카테고리 카드 */}
      <Box
        bgcolor="#f7f7f7"
        py={4}
        display="flex"
        justifyContent="center"
        gap={10}
      >
        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "200" } })}
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
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                시
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "100" } })}
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
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                소설
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "300" } })}
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
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                수필
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={cardStyle}
          onClick={() => navigate(`/library`, { state: { category: "400" } })}
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
                sx={{ marginTop: "5px", color: "#246624" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                공유세상
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 도서 정보 카드 */}
      <Card
        sx={{
          width: 1100,
          maxWidth: "90vw",
          margin: "auto",
          mt: 4,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: '#F8FBF8 ',
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          sx={{ width: "100%", pl: 7 }}
        >
          <Paper
            sx={{
              width: "350px", // 컨테이너 너비 조정
              height: "400px", // 컨테이너 높이 조정
              backgroundColor: "#d3d3d3",
              borderRadius: "10px",
              overflow: "hidden", // 모서리의 radius에 맞게 잘리도록 설정
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={`/static/image/bookcover/${book.IMG_PATH}`}
              alt={"책 커버 사진 없음"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Paper>

          {/* 도서 정보와 버튼들 */}
          <Stack
            spacing={2}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">{book.BOOK_NAME}</Typography>

            <Box
              sx={{
                width: "60%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ mb: 2 }}
              >
                {book.FULL_PATH}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                {book.INFORMATION}
              </Typography>

              {/* 버튼 그룹 */}
              <Stack
                spacing={2}
                mt={3}
                sx={{ width: "100%", alignItems: "center" }}
              >
                {/* AI 요약듣기 버튼 */}
                <Button
                  variant="outlined"
                  onClick={async () => {
                    setIsLoading(true); // 로딩 시작
                    await handleAISummary();
                    setIsLoading(false); // 요약 생성 완료 후에도 로딩 유지
                    
                  }}
                  disabled={category === "200" || summaryLoading || isLoading} // 카테고리가 200이면 비활성화
                  sx={{
                    width: "400px",
                    fontWeight: "Bold",
                    color: "#B833BA",
                    borderColor: "#B833BA",
                    backgroundColor: "#E9B6EA",
                    "&:hover": {
                      color: "#FFFFFF",
                      borderColor: "#FFFFFF",
                      backgroundColor: "#B833BA",
                    },
                  }}
                >
                  {summaryLoading ? "요약 생성 중..." : "AI요약듣기"}
                </Button>

                {/* 나머지 버튼들 */}
                {isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <>
                    {hasHistory ? (
                      <>
                        <Button
                          variant="outlined"
                          onClick={async () => {
                            setIsLoading(true); // 로딩 시작
                            await handleListenFromStart();
                            setIsLoading(false); // 로딩 종료
                          }}
                          disabled={isLoading}
                          sx={{
                            width: "400px",
                            fontWeight: "Bold",
                            color: "#246624",
                            borderColor: "#246624",
                            backgroundColor: "#DCEEDC",
                            "&:hover": {
                              color: "#FFFFFF",
                              borderColor: "#FFFFFF",
                              backgroundColor: "#246624",
                            },
                          }}
                        >
                          처음부터 듣기
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={async () => {
                            setIsLoading(true); // 로딩 시작
                            await handleContinueListening();
                            setIsLoading(false); // 로딩 종료
                          }}
                          disabled={isLoading}
                          sx={{
                            width: "400px",
                            fontWeight: "Bold",
                            color: "#246624",
                            borderColor: "#246624",
                            backgroundColor: "#DCEEDC",
                            "&:hover": {
                              color: "#FFFFFF",
                              borderColor: "#FFFFFF",
                              backgroundColor: "#246624",
                            },
                          }}
                        >
                          이어 듣기
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={async () => {
                          setIsLoading(true); // 로딩 시작
                          await handleListenFromStart();
                          setIsLoading(false); // 로딩 종료
                        }}
                        disabled={isLoading}
                        sx={{
                          width: "400px",
                          fontWeight: "Bold",
                          color: "#246624",
                          borderColor: "#246624",
                          backgroundColor: "#DCEEDC",
                          "&:hover": {
                            color: "#FFFFFF",
                            borderColor: "#FFFFFF",
                            backgroundColor: "#246624",
                          },
                        }}
                      >
                        전체 듣기
                      </Button>
                    )}
                  </>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default Book;
