import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkUserId, joinSubmit } from "../api/userAPI";
import { verifyDisabilityCode } from "../api/authAPI";
import logo1 from "../assets/logo1.png";

function Join() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [pwMessage, setpwMessage] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    pw: "",
    pwok: "",
    disabled: "",
  });
  const [isVerified, setIsVerified] = useState(false); // 인증 상태 관리

  const handleJoinInput = ({ target: { name, value } }) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckUserId = async () => {
    try {
      if (!formData.userId) {
        setMessage("아이디를 입력해주세요.");
        return;
      }
      const exists = await checkUserId(formData.userId);
      setMessage(
        exists ? "아이디가 이미 사용 중입니다." : "사용 가능한 아이디입니다."
      );
    } catch {
      setMessage("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!formData.pw && !formData.pwok) {
      setpwMessage("");
      return;
    }
    if (!formData.pw || !formData.pwok) {
      setpwMessage("비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }
    if (formData.pw === formData.pwok) {
      setpwMessage("패스워드가 일치합니다.");
    } else {
      setpwMessage("패스워드가 일치하지 않습니다.");
    }
  }, [formData.pw, formData.pwok]); // pw나 pwok가 변경될 때마다 실행

  const handleVerifyDisabledCode = async () => {
    if (!formData.disabled) {
      setMessage("장애등록코드를 입력해주세요.");
      return;
    }
  
    try {
      const result = await verifyDisabilityCode(formData.disabled);
      if (result.success) {
        setMessage(result.message || "장애등록 코드가 인증되었습니다.");
        setIsVerified(true); // 인증 완료 상태로 변경
      } else {
        setMessage(result.message || "유효하지 않은 코드입니다.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "인증 중 오류가 발생했습니다.");
    }
  };
  

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      setMessage("장애등록코드 인증이 필요합니다.");
      return;
    }

    try {
      const message = await joinSubmit(e, formData);
      console.log(
        message ? "회원가입을 완료하였습니다." : "회원가입에 실패하였습니다."
      );
      if (message) {
        navigate("/");
      }
    } catch {
      console.log("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Card
        sx={{
          backgroundColor: "#ffe0b2",
          width: "100%",
          maxWidth: 1000,
          padding: 4,
          boxShadow: 10,
          borderRadius: 2,
        }}
      >
        <Box
          component="img"
          src={logo1}
          alt="Logo"
          sx={{
            position: "absolute",
            marginTop: "10px",
            marginLeft: "18%",
            height: 80,
            width: "auto",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontSize: "36px",
            mb: 4,
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          회원가입
        </Typography>
        <form onSubmit={handleJoin}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              padding: 3,
            }}
          >
            <Grid
              container
              spacing={3}
              alignItems="center"
              sx={{ maxWidth: 800, marginLeft: "-100px" }}
            >
              {" "}
              {/* 최대 너비 설정하여 가운데 정렬 유지 */}
              <Grid item xs={3}>
                <Typography sx={{ textAlign: "right", fontWeight: "bold" }}>
                  아이디
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  name="userId"
                  onChange={handleJoinInput}
                  value={formData.userId}
                  sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }} // 배경색 변경
                />
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "right" }}>
                <Button
                  onClick={handleCheckUserId}
                  variant="contained"
                  size="medium" // 버튼 크기 키우기
                  sx={{
                    minWidth: 100,
                    bgcolor: "#FFB74D",
                    color: "#000000",
                    "&:hover": {
                      bgcolor: "#FFFFFF",
                      color: "#FFB74D",
                      border: "1px solid #FFB74D",
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    중복확인
                  </Typography>
                </Button>
              </Grid>
              {message && (
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      color: message.includes("가능") ? "green" : "red",
                      mt: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {message}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={3}>
                <Typography sx={{ textAlign: "right", fontWeight: "bold" }}>
                  비밀번호
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  type="password"
                  name="pw"
                  onChange={handleJoinInput}
                  value={formData.pw}
                  sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }} // 배경색 변경
                />
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ textAlign: "right", fontWeight: "bold" }}>
                  비밀번호 확인
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  type="password"
                  name="pwok"
                  onChange={handleJoinInput}
                  value={formData.pwok}
                  sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }} // 배경색 변경
                />
              </Grid>
              {pwMessage && (
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      color: pwMessage.includes("일치합니다") ? "green" : "red",
                      mt: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {pwMessage}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={3}>
                <Typography sx={{ textAlign: "right", fontWeight: "bold" }}>
                  장애등록코드
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  name="disabled"
                  onChange={handleJoinInput}
                  value={formData.disabled}
                  disabled={isVerified}
                  sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }} // 배경색 변경
                />
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "right" }}>
                <Button
                  onClick={handleVerifyDisabledCode}
                  variant="contained"
                  size="medium" // 버튼 크기 키우기
                  sx={{
                    minWidth: 100,
                    bgcolor: isVerified ? "success.main" : "#FFB74D",
                    color: "#000000",
                    "&:hover": {
                      bgcolor: "#FFFFFF",
                      color: isVerified ? "success.main" : "#FFB74D",
                      border: `1px solid ${
                        isVerified ? "success.main" : "#FFB74D"
                      }`,
                    },
                  }}
                  disabled={isVerified}
                >
                  <Typography variant="body1" fontWeight="bold">
                    인증확인
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              width: "100%", // Box 너비를 화면 전체로 설정
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 5,
            }}
          >
            <Grid container spacing={5} sx={{ width: "100%", maxWidth: 700 }}>
              {" "}
              {/* Grid를 중앙 정렬하고 너비를 제한 */}
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "100%",
                    bgcolor: "#FFB74D",
                    color: "#000000",
                    border: "1px solid #FFB74D",
                    "&:hover": {
                      bgcolor: "#FFFFFF",
                      color: "#FFB74D",
                      border: "1px solid #FFB74D",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ marginTop: "5px" }}>
                    가입완료
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    width: "100%",
                    bgcolor: "#FFFFFF",
                    color: "#000000",
                    border: "1px solid #FFB74D",
                    "&:hover": {
                      bgcolor: "#FFB74D",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ marginTop: "5px" }}>
                    취소
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Card>
    </Box>
  );
}

export default Join;
