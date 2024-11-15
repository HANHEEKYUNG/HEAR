from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from datetime import timedelta

history_bp = Blueprint('historys', __name__)

# timedelta 객체를 문자열로 변환하는 함수
def convert_timedelta_to_str(historys):
    for history in historys:
        for key, value in history.items():
            if isinstance(value, timedelta):
                history[key] = str(value)  # timedelta 객체를 문자열로 변환
    return historys

# 공지사항 전체 조회 (Read)
@history_bp.route('/historys', methods=['GET'])
def get_all_historys():
    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 공지사항 조회 쿼리
            query = text("""
                SELECT *
                FROM history h
                LEFT JOIN book b ON h.BOOK_SEQ = b.BOOK_SEQ
            """)
            result = connection.execute(query)

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            historys = [
                dict(zip(keys, row))
                for row in result.fetchall()
            ]

             # timedelta 객체를 문자열로 변환
            historys = convert_timedelta_to_str(historys)

            return jsonify(historys)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch history4"}), 500

        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
