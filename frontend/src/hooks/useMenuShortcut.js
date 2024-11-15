import { useEffect, useState } from 'react';

const useMenuShortcut = (shortcuts) => {
  const [keyBuffer, setKeyBuffer] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      // 숫자 키가 눌리면 buffer에 저장
      if (event.key >= '1' && event.key <= '9') {
        setKeyBuffer(event.key);
      } else if (event.key === '.' && keyBuffer) {
        const action = shortcuts[keyBuffer];
        if (action) {
          action(); // navigate 함수를 전달하여 라우팅 처리
        }
        setKeyBuffer(''); // buffer 초기화
      } else {
        setKeyBuffer(''); // 다른 키 입력 시 buffer 초기화
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyBuffer, shortcuts]);

  return null;
};

export default useMenuShortcut;
