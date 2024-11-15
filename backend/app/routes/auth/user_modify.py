from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from datetime import datetime, timedelta

# Blueprint를 사용하여 라우트 분리
user_modify_bp = Blueprint('user_modify', __name__)

@user_modify_bp.route('/user-modify', methods=['POST'])
def user_modify():
    data =  request.json.get('formData')
    print("제발 나와라 얍", data)
    if not data:
        return jsonify({"error": "Invalid input data"}), 400

    user_id = data.get('id')
    pw = data.get('pw')
    nickName = data.get('nickName')
    
   # 현재 시간에 9시간을 더하기
    modified_date = datetime.now() + timedelta(hours=9)
    
    # 요청 데이터 로깅
    print(f"Received User ID: {user_id}")
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    connection = get_db_connection()
    if connection:
        try:
            # SQLAlchemy Connection 객체에서 직접 execute 사용
            query = text("UPDATE user SET USER_PW = :pw, NICKNAME = :nickName, USER_MdfDt = :modified_date WHERE USER_ID = :user_id")
            result = connection.execute(query, {"pw": pw, "nickName": nickName, "modified_date": modified_date, "user_id": user_id})
            count = result.rowcount  # 업데이트된 행의 수 가져오기
            print("금나와라 뚝딱", count)

            if count > 0:
                connection.commit()
                return jsonify({"success": True}), 200
            else:
                return jsonify({"success": False, "message": "No rows updated"}), 400
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            close_db_connection(connection)  # 연결 닫기 함수 사용
    return jsonify({"error": "Database connection failed"}), 500
