import axios from 'axios';

// 책 추가
export const fetchBookAdd = async (formData) => {

    
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
  
  try {
    const response = await axios.post('/api/admin/bookAdd', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookAdd data:', error);
    throw error;
  }
};

// 책 호출
export const fetchBookData = async () => {      
  try {
    const response = await axios.post('/api/admin/bookData');
    console.log("Response data:", response.data); // 응답 데이터 구조 확인
    return response.data.bookData;
  } catch (error) {
    console.error('Error fetching bookData data:', error);
    throw error;
  }
};

// 책 삭제
export const fetchBookDelete = async (bookseq) => {    
  console.log(bookseq, "bookdsdfsdfsdfsdfsdfsdfsfsdfseq");
  
  try {
    const response = await axios.post('/api/admin/bookDelete', { bookseq });
    return response.data;
  } catch (error) {
    console.error('Error fetching delete data:', error);
    throw error;
  }
};

