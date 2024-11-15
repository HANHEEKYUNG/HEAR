from flask import request, jsonify, Blueprint
from app.model import get_db_connection
from sqlalchemy import text
import app.utils.nickname as nickname

# Blueprint를 사용하여 라우트 분리
join_bp = Blueprint('join', __name__)

@join_bp.route('/join', methods=['POST'])
def join():
    data = request.get_json()
    id = data.get('userId')
    pw = data.get('pw')
    pwok = data.get('pwok')
    disabled = data.get('disabled')    

    connection = get_db_connection()
    if connection:
        try:
            # 1. 사용자 ID가 이미 존재하는지 확인
            check_query = text("SELECT COUNT(*) FROM user WHERE USER_ID = :id")
            result = connection.execute(check_query, {"id": id}).scalar()
            
            if result > 0:
                # 2. 이미 존재하는 사용자라면 에러 반환
                return jsonify({"error": "User ID already exists"}), 409
            
            if pw != pwok:
                return jsonify({"error": "유저 패스워드 불일치"}), 410
            
            # 사용자가 존재하지 않으면 새로운 사용자 추가
            user_insert_query = text("INSERT INTO user (USER_ID, USER_PW, NICKNAME, EL_ID, SPEED, DISABLED_CODE, USER_CrtDt) VALUES (:id, :pw, :nickname, :el_id, :speed, :disabled, now())")
            connection.execute(user_insert_query, {"id": id, "pw": pw, "nickname": nickname.nickName(), 'el_id':"XOjX7HuCs6jtaR1NqWIW", 'speed':1 , "disabled": disabled})

            # 방금 삽입한 USER_SEQ 가져오기
            user_seq_query = text("SELECT LAST_INSERT_ID()")
            user_seq = connection.execute(user_seq_query).scalar()
            
            # voice_list 테이블에 두 개의 행 추가
            voice_insert_query = text("INSERT INTO voice_list (USER_SEQ, EL_ID, VL_NAME, VL_SPEED, VL_PITCH, VL_CrtDt) VALUES (:user_seq, :el_id, :vl_name, :vl_speed, :vl_pitch, now())")
            connection.execute(voice_insert_query, {"user_seq": user_seq, "el_id": "XOjX7HuCs6jtaR1NqWIW", "vl_name": "남성(기본)", "vl_speed": 1, "vl_pitch": 1})
            connection.execute(voice_insert_query, {"user_seq": user_seq, "el_id": "CmvK4l3jURa7bBhVQAgX", "vl_name": "여성(기본)", "vl_speed": 1, "vl_pitch": 1})

            # 인증 코드 비활성화
            disable_code_query = text("UPDATE disability_code SET is_active = 1 WHERE code = :disabled")
            connection.execute(disable_code_query, {"disabled": disabled})

            connection.commit()
            
            return jsonify({"message": True})

        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            connection.close()

    return jsonify({"error": "Database connection failed"}), 500
