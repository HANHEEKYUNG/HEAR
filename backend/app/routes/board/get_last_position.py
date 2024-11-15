from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from datetime import timedelta

history_bp = Blueprint('history', __name__)

@history_bp.route('/history/last-position', methods=['GET'])
def get_last_position():
    user_seq = request.args.get("USER_SEQ")
    book_seq = request.args.get("BOOK_SEQ")

    # 필수 파라미터 확인
    if not user_seq or not book_seq:
        return jsonify({"error": "USER_SEQ와 BOOK_SEQ는 필수 항목입니다."}), 400

    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                SELECT HIST_EdPt
                FROM history
                WHERE USER_SEQ = :user_seq AND BOOK_SEQ = :book_seq
                ORDER BY HIST_VwDt DESC
                LIMIT 1
            """)
            result = connection.execute(query, {"user_seq": user_seq, "book_seq": book_seq}).fetchone()

            # 초 단위로 변환하여 반환
            last_position = result[0].total_seconds() if result and isinstance(result[0], timedelta) else 0
            
            return jsonify({"lastPosition": last_position}), 200
        except Exception as e:
            print(f"Error fetching last position: {e}")
            return jsonify({"error": "Failed to fetch last position"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
