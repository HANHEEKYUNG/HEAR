from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# Blueprint를 사용하여 라우트 분리
check_nickname_bp = Blueprint('check_nickname', __name__)

@check_nickname_bp.route('/check-nickname', methods=['POST'])
def check_nickname():
    nickname = request.json.get('nickname')

    # 요청 데이터 로깅
    print(f"Received User nickname: {nickname}")
    
    if not nickname:
        return jsonify({"error": "User NickName is required"}), 400
    
    connection = get_db_connection()
    if connection:
        try:
            # SQLAlchemy Connection 객체에서 직접 execute 사용
            query = text("SELECT COUNT(*) FROM user WHERE NICKNAME = :nickname")
            result = connection.execute(query, {"nickname": nickname})
            count = result.fetchone()[0] if result else 0

            if count > 0:
                return jsonify({"exists": True})
            else:
                return jsonify({"exists": False})
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            close_db_connection(connection)  # 연결 닫기 함수 사용
    return jsonify({"error": "Database connection failed"}), 500


