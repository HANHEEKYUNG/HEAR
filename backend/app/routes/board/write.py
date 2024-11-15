# app/routes/notices.py
from flask import Blueprint, request, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from datetime import datetime
from pytz import timezone



write_bp = Blueprint('write', __name__)

# 공지사항 작성 API 엔드포인트
@write_bp.route('/write', methods=['POST'])
def write():
    data = request.get_json()
    user_seq = data.get('userseq')
    title = data.get('title')
    detail = data.get('detail')
    created_at = datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M:%S')  # 현재 시간

    if not all([user_seq, title, detail]):
        return jsonify({'error': '모든 필드를 입력해주세요.'}), 400

    # 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # SQL 삽입문
            query = text("""
                INSERT INTO notice (USER_SEQ, NOTICE_DIV, NOTICE_TITLE, NOTICE_DETAIL, NOTICE_CrtDt)
                VALUES (:user_seq, :notice_div, :title, :detail, :created_at)
            """)
            connection.execute(query, {
                'user_seq': user_seq,
                'notice_div': 2,  # NOTICE_DIV 값을 기본값 1로 설정
                'title': title,
                'detail': detail,
                'created_at': created_at
            })

            # 커밋 후 성공 응답 반환
            connection.commit()
            return jsonify({'message': '게시글이 성공적으로 작성되었습니다.'}), 201
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500
