import { createTheme } from '@mui/material/styles';

// 색상 팔레트를 별도로 설정해 참조 가능하도록 만듭니다.
const palette = {
    primary: {
        main: '#FFB74D',  // 메인 컬러 - 노란색
        contrastText: '#000000',  // 대비되는 텍스트 색상
    },
    secondary: {
        main: '#000000',  // 버튼과 브레드크럼 색상 - 검정색
        contrastText: '#FFFFFF',
    },
    text: {
        primary: '#000000',  // 기본 텍스트 색상 - 검정색
        secondary: '#666666',  // 푸터 및 보조 텍스트 색상 - 회색
    },
    background: {
        default: '#FFFFFF'
    },
};

// 테마 생성
const theme = createTheme({
    typography: {
        fontFamily: 'GoormSansRegular, sans-serif',  // 기본 폰트 설정
        h1: { fontFamily: 'GoormSansBold' },
        h2: { fontFamily: 'GoormSansBold' },
        h3: { fontFamily: 'GoormSansBold' },
        h4: { fontFamily: 'GoormSansMedium' },
        h5: { fontFamily: 'GoormSansMedium' },
        h6: { fontFamily: 'Recipekorea' },
        b_font: { fontFamily: 'Recipekorea', fontSize: '24px' },
        body1: { fontFamily: 'GoormSansMedium' },
        body2: { fontFamily: 'GoormSansMedium' },
        body3: { fontFamily: 'Recipekorea' },
        body4: { fontFamily: 'GoormSansRegular', color: '#FFFFFF', whiteSpace:'pre-wrap',  marginRight: '20px' },
    },
    palette,  // 설정한 팔레트를 테마에 적용
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: 'GoormSansRegular, sans-serif',
                    color: palette.text.primary,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,  // 둥근 모서리
                    textTransform: 'none',  // 대문자 해제
                    padding: '8px 16px',
                },
                containedPrimary: {
                    backgroundColor: palette.primary.main,  // 메인 컬러로 설정
                    color: palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: '#FFD433',  // 조금 더 밝은 노란색으로 호버
                    },
                },
                containedSecondary: {
                    backgroundColor: palette.secondary.main,  // 검정색
                    color: palette.secondary.contrastText,
                    '&:hover': {
                        backgroundColor: '#333333',
                    },
                },
            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    color: palette.text.primary,  // 다이얼로그 텍스트 색상 설정
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: palette.background.default,  // 다이얼로그 배경색
                },
            },
        },
    },
});


export default theme;
