import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  CardContent,
  Card,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
// import { useAuth } from '../../context/AuthContext';
import { fetchNoticeDetail } from "../../api/boardAPI";
import { formatInTimeZone } from 'date-fns-tz';

const NoticeDetail = () => {
  //   const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const notice_seq = location.state.selected;

  useEffect(() => {
    console.log("selected", notice_seq);

    const getReport = async () => {
      try {
        const data = await fetchNoticeDetail(notice_seq);
        console.log("data", data.data);
        setReport(data.data);
      } catch (error) {
        console.error("Error fetching Notice detail report:", error);
      }
    };
    getReport();
  }, [notice_seq]);

  if (report) {
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

        <Container maxWidth="xl" sx={{ mt: 3, marginTop: "0px" }}>
          <Card
            sx={{
              width: 1200,
              margin: "auto",
              mt: 4,
              p: 10,
              borderRadius: 5,
              boxShadow: 10,
              bgcolor: "#ffe0b2",
              mb: 10,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  mb: 4,
                  marginTop: "-50px",
                  padding: 2,
                  bgcolor: "#FFFAF3",
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  align="center"
                  sx={{ fontSize: "24px", mb: -1 }}
                >
                  {report.NOTICE_TITLE}
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                align="right"
                gutterBottom
              >
                작성일:{" "}
                {report.NOTICE_MdfDt
                  ? formatInTimeZone(new Date(report.NOTICE_MdfDt), 'UTC', 'yyyy.MM.dd')
                  : formatInTimeZone(new Date(report.NOTICE_CrtDt), 'UTC', 'yyyy.MM.dd')}
                <br></br>
                작성자: {report.NICKNAME}
              </Typography>
              <Box sx={{ mt: 4 }}>
                {/* <Typography variant="h6" sx={{ mb: 1 , ml: 2}}>
              제목
            </Typography>
            <Typography variant="body1" sx={{ padding: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              {report.NOTICE_TITLE}
            </Typography> */}

                {/* <Typography variant="h6" sx={{ ml: 2, mt: 4, mb: 1 }}>
              내용
            </Typography> */}
                <Typography
                  variant="body1"
                  sx={{ padding: 1, bgcolor: "#FFFAF3", borderRadius: 3 }}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {report.NOTICE_DETAIL}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }
};
export default NoticeDetail;
