from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from datetime import timedelta, time
import os

# 타임델타 수정
def convert_special_types_to_str(book_data_list):
    for bookData in book_data_list:
        for key, value in bookData.items():
            if isinstance(value, timedelta) or isinstance(value, time):
                bookData[key] = str(value)  # timedelta 및 time 객체를 문자열로 변환
    return book_data_list

# # bookAdd 블루프린트 생성
bookAdd_bp = Blueprint('bookAdd', __name__)

# 1. 책 추가 (관리자용)
@bookAdd_bp.route('/admin/bookAdd', methods=['POST'])
def bookAdd():
    print("Request form data:", request.form)
    print("Request files:", request.files)
    
    category = request.form.get('category')
    title = request.form.get('title')
    author = request.form.get('author')
    publisher = request.form.get('publisher')
    information = request.form.get('information')
    textdata = request.form.get('text')  # 파일은 request.files에서 가져옵니다
    img_file = request.files.get('img')
    
    print("얍얍", img_file.filename)

    # 'backend/app/img/bookcover' 디렉터리 생성
    base_dir = os.path.abspath(os.path.dirname(__file__))  # 현재 파일 위치 기준 절대 경로
    img_upload_dir = os.path.join(base_dir, '../../static/image/bookcover')
    
    
    if not os.path.exists(img_upload_dir):
        os.makedirs(img_upload_dir)
        
    

    # 파일 저장
    if img_file:
        img_filename = img_file.filename
        img_save_path = os.path.join(img_upload_dir, img_filename)
        img_file.save(img_save_path)
 
              
    # 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # SQL 삽입문
            query = text("""
                INSERT INTO book (CATEGORY, BOOK_NAME, IMG_PATH, AUTHOR, PUBLISHER, INFORMATION, BOOK_TEXT,BOOK_CrtDt)
                VALUES (:category, :bookname, :imgpath, :author, :publisher, :information, :textdata, NOW())
            """)
            connection.execute(query, {
                'category': category,
                'bookname': title,  
                'imgpath': img_filename,
                'author': author,
                'publisher': publisher,
                'information' : information,
                'textdata' :textdata                            
            })
            
            # 커밋 후 성공 응답 반환
            connection.commit()
            return jsonify({'message': '도서가 성공적으로 등록되었습니다.'}), 200
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500


# 2. 책 목록 확인 (관리자용)
@bookAdd_bp.route('/admin/bookData', methods=['POST'])
def bookData():
    connection = get_db_connection()
   
    if connection:
        try:
            # SQL 삽입문
            query = text(" SELECT *, DATE_FORMAT(BOOK_CrtDt, '%Y.%m.%d') AS formatted_date FROM book ORDER BY BOOK_CrtDt DESC  ")
            print(query,"query")
            result = connection.execute(query)
            keys = result.keys()
            bookData = [
                dict(zip(keys, row))
                for row in result.fetchall()
            ]
            book_data_list = convert_special_types_to_str(bookData)
     
            return jsonify({'bookData':book_data_list}), 200
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500


# 3. 책 삭제 (관리자용)
@bookAdd_bp.route('/admin/bookDelete', methods=['POST'])
def bookDelete():
    print("안녕하세요")
    bookseq= request.json.get("bookseq")
    print(bookseq)

    connection = get_db_connection()
    if connection:
            try:
                query = text("""
                    DELETE FROM book
                    WHERE BOOK_SEQ = :bookseq; 
                """)
                connection.execute(query, {
                   "bookseq":bookseq
                })
                
                connection.commit()
                return jsonify({"exists": True})
  

            except Exception as db_error:
                print(f"Database operation failed: {db_error}")
                return jsonify({"error": "Failed to fetch suggest detail"}), 500
            finally:
                close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
    
