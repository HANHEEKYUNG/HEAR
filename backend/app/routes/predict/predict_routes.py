import sys
import csv
import io
from flask import Blueprint, request, jsonify
import pickle
from kiwipiepy import Kiwi, basic_typos_with_continual
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
import time
from threading import Thread
from queue import Queue

# Blueprint 정의 및 Kiwi 형태소 분석기 초기화
predict_bp = Blueprint('predict', __name__)
kiwi = Kiwi(typos=basic_typos_with_continual)
progress = 0  # 예측 진행률 추적 변수
upload_total_rows = 0  # 업로드된 처리 건수를 저장하는 전역 변수

# 모델 및 벡터라이저를 전역 변수로 선언
tfidf = None
logi = None
category = None

# 사용자 정의 토크나이저 함수
def myTokenizer(text):
    result = kiwi.tokenize(text)
    for token in result:
        if token.tag in ['NNG', 'NNP']:
            yield token.form

# 모델 및 벡터라이저 로드 함수 (한 번만 로드)
def load_model():
    global tfidf, logi, category
    sys.modules['__main__'].myTokenizer = myTokenizer
    try:
        if tfidf is None or logi is None:
            with open('app/models/tfidf_vectorizer.pkl', 'rb') as f:
                tfidf = pickle.load(f)
            with open('app/models/category_model.pkl', 'rb') as f:
                logi = pickle.load(f)
            category = ['건강', '기타', '먹거리', '여행', '인터뷰', '해설']
            print("모델 로드 성공")  # 모델 로드 성공 로그
    except Exception as e:
        print(f"모델 로드 중 오류 발생: {e}")  # 모델 로드 오류 로그

# 예측 진행률 추적 Queue 추가
progress_queue = Queue()

# CSV 파일 업로드 및 예측 시작 처리
@predict_bp.route('/upload_csv', methods=['POST'])
def upload_csv():
    print("upload_csv 엔드포인트에 도달했습니다.")  # 로그 추가
    global progress, upload_total_rows
    load_model()  # 모델 로드
    
    try:
        if 'file' not in request.files:
            print("파일이 업로드되지 않았습니다.")  # 디버깅용 로그
            return jsonify({"error": "파일이 업로드되지 않았습니다."}), 400

        file = request.files['file']
        print("파일 이름:", file.filename)  # 파일 업로드 확인
        if file.filename == '':
            return jsonify({"error": "업로드된 파일에 이름이 없습니다."}), 400

        # CSV 파일 읽기 및 파싱
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)

        # JSON_DETAIL과 관련 정보를 저장 및 DB 삽입
        subtitles = []
        for row in reader:
            subtitles.append({
                'PRO_NAME': row.get('program_name', 'unknown'),
                'JSON_PUBLISHER': row.get('publisher', 'unknown'),
                'INFORMATION' : row.get('information', ''),
                'JSON_DETAIL': row.get('subtitle', ''),
                'JSON_DIVISION': row.get('category', '')
            })

        upload_total_rows = len(subtitles)  # 업로드된 행 수를 전역 변수에 저장
        print(f"Uploaded row count set to: {upload_total_rows}")  # 디버깅용 로그

        # 총 row 수 계산하여 예측 함수에 전달
        total_rows = len(subtitles)

        # DB에 저장
        connection = get_db_connection()
        print("DB 연결 성공")  # DB 연결 성공 여부 확인
        try:
            for item in subtitles:
                insert_query = text("""
                    INSERT INTO json (PRO_NAME, JSON_PUBLISHER, INFORMATION, JSON_DETAIL, JSON_DIVISION, JSON_CrtDt) 
                    VALUES (:PRO_NAME, :JSON_PUBLISHER, :INFORMATION, :JSON_DETAIL, :JSON_DIVISION, NOW())
                """)
                connection.execute(insert_query, item)
            connection.commit()
            print("DB 저장 성공")  # DB 저장 성공 여부 확인
        finally:
            close_db_connection(connection)

        # 새 Queue를 생성하여 전달
        progress_queue = Queue()
        progress = 0  # 진행률 초기화
        Thread(target=perform_predictions, args=(subtitles, total_rows, progress_queue)).start()  # 예측에 파싱한 데이터를 전달
        return jsonify({"message": "파일 업로드 성공 및 예측 시작"}), 200
    except Exception as e:
        print(f"Error in /upload_csv: {e}")
        return jsonify({"error": "서버 내부 오류가 발생했습니다."}), 500

# 예측 수행 비동기 함수
def perform_predictions(subtitles, total_rows, queue):
    global progress
    connection = get_db_connection()
    processed_count = 0
    
    try:
        for item in subtitles:
            # 예측 및 신뢰도 계산
            vect_sentence = tfidf.transform([item['JSON_DETAIL']])
            pre = logi.predict(vect_sentence)  # 예측 결과 (카테고리 이름 문자열)

            predicted_category = pre[0]  # 예측된 카테고리 이름 (예: '인터뷰')

            # 디버깅 로그 추가
            print(f"Updating JSON_DETAIL: {item['JSON_DETAIL']}")
            print(f"예측 카테고리: {predicted_category}")

            # DB에 예측 결과 업데이트
            update_query = text("""
                UPDATE json 
                SET JSON_DIVISION = :category,                     
                    JSON_MdfDt = NOW()
                WHERE JSON_DETAIL = :detail
            """)
            result = connection.execute(update_query, {
                "detail": item['JSON_DETAIL'],
                "category": predicted_category
            })
            connection.commit()
            
            # 업데이트 성공 여부 확인
            if result.rowcount == 0:
                print("Warning: No rows were updated. Check JSON_DETAIL for exact match.")


            # 진행률 업데이트
            processed_count += 1
            progress = (processed_count / total_rows) * 100
            queue.put(progress)  # 진행률을 큐에 넣음
            time.sleep(0.5)  # 테스트용 지연

        # 최종 완료 시 100% 전송
        queue.put(100)
    except Exception as db_error:
        print(f"Database operation failed: {db_error}")
    finally:
        close_db_connection(connection)
        progress = 100  # 모든 예측이 완료된 후에 progress를 100으로 설정.


# 예측 진행률 스트리밍 엔드포인트
@predict_bp.route('/progress_status', methods=['GET'])
def progress_status():
    global progress  # 현재 진행률
    return jsonify({"progress": progress})  # 진행률 반환



# 예측 결과 조회 엔드포인트
@predict_bp.route('/get_results', methods=['GET'])
def get_results():
    connection = get_db_connection()
    try:
        # 업로드된 건수만큼만 조회
        query = text("""
            SELECT JSON_DETAIL, JSON_DIVISION, JSON_MdfDt 
            FROM json 
            ORDER BY JSON_CrtDt DESC 
            LIMIT :upload_total_rows
        """)
        result = connection.execute(query, {'upload_total_rows': upload_total_rows})
        
        # 각 행을 딕셔너리 형태로 변환
        results = [
            {
                "JSON_DETAIL": row._mapping["JSON_DETAIL"],
                "JSON_DIVISION": row._mapping["JSON_DIVISION"],
                "JSON_MdfDt": row._mapping["JSON_MdfDt"].strftime("%Y-%m-%d %H:%M:%S")  # datetime을 문자열로 변환
            }
            for row in result
        ]
        
        return jsonify(results)
    except Exception as e:
        print(f"Error fetching results: {e}")
        return jsonify({"error": "Failed to fetch results"}), 500
    finally:
        close_db_connection(connection)

# json 테이블의 데이터를 book 테이블로 삽입하는 API
@predict_bp.route('/add-book-from-json', methods=['POST'])
def add_book_from_json():
    global upload_total_rows
    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                INSERT INTO book (CATEGORY, BOOK_NAME, AUTHOR, INFORMATION, BOOK_TEXT, BOOK_CrtDt)
                SELECT 
                    CASE 
                        WHEN JSON_DIVISION = '건강' THEN 410
                        WHEN JSON_DIVISION = '기타' THEN 420
                        WHEN JSON_DIVISION = '먹거리' THEN 430
                        WHEN JSON_DIVISION = '여행' THEN 440
                        WHEN JSON_DIVISION = '인터뷰' THEN 450
                        WHEN JSON_DIVISION = '해설' THEN 460
                        ELSE NULL
                    END AS CATEGORY,
                    PRO_NAME AS BOOK_NAME,
                    JSON_PUBLISHER AS AUTHOR,
                    INFORMATION AS INFORMATION,
                    JSON_DETAIL AS BOOK_TEXT,
                    JSON_MdfDt AS BOOK_CrtDt
                FROM json
                WHERE JSON_DIVISION IS NOT NULL                
                ORDER BY JSON_CrtDt DESC
                LIMIT :upload_total_rows
            """)
            result = connection.execute(query, {'upload_total_rows': upload_total_rows})
            connection.commit()           
            
            return jsonify({
                "message": "Data inserted into book table",
                "information": f"{result.rowcount} rows of JSON_DETAIL added to INFORMATION column in book table."
            }), 201
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to insert data into book table"}), 500
        finally:
            close_db_connection(connection)
    return jsonify({"error": "Database connection failed"}), 500