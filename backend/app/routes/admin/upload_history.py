from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# 공유마당 블루프린트 생성
upload_history_bp = Blueprint('upload_history', __name__)

# 업로드 이력 조회 엔드포인트
@upload_history_bp.route('/admin/upload-history', methods=['GET'])
def get_upload_history():
    connection = get_db_connection()

    if connection:
        try:
            # 업로드 이력을 프론트엔드에 맞게 조회하는 쿼리
            query = text("""
                SELECT 
                    JSON_CrtDt AS upload_date,
                    PRO_NAME AS file_name,
                    JSON_DIVISION AS status,
                    COUNT(JSON_SEQ) AS record_count
                FROM json
                GROUP BY JSON_CrtDt, PRO_NAME, JSON_DIVISION
                ORDER BY JSON_CrtDt DESC
            """)
            result = connection.execute(query)

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            upload_history = [dict(zip(keys, row)) for row in result.fetchall()]

            return jsonify(upload_history)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch upload history"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
