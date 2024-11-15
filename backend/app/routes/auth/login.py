from flask import Flask, request, jsonify, Blueprint
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from app.utils.jwt_utils import create_jwt_token  # JWT 생성 함수 가져오기

app = Flask(__name__)

# Blueprint를 사용하여 라우트 분리
login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    print('운영 login!!')
    data = request.json  # Get JSON data from React
    userid = data.get('userid')
    userpw = data.get('userpw')

    print(f"Received User ID: {userid}, User PW: {userpw}")

    # Connect to the MySQL database
    connection = get_db_connection()

    if connection:
        try:
        # Query to find the user
             query = text("SELECT * FROM user WHERE USER_ID = :userid AND USER_PW =:userpw")
             result = connection.execute(query, {"userid": userid, "userpw": userpw})
             print('result', result)
             userInfo = result.fetchone()
             print( "오잉크" , userInfo)
             
             if userInfo:
                userInfo = dict(zip(result.keys(), userInfo))
                print("userInfo", userInfo)

                # USER_CrtDt 필드가 존재하면 문자열 형식으로 변환
                if 'USER_CrtDt' in userInfo and userInfo['USER_CrtDt'] is not None:
                    userInfo['USER_CrtDt'] = userInfo['USER_CrtDt'].isoformat()  # ISO 8601 형식으로 변환

                # utils에 분리된 JWT 생성 함수 호출
                token = create_jwt_token({
                    "USER_SEQ": userInfo['USER_SEQ'],
                    "USER_ID": userInfo['USER_ID'],
                    "NICKNAME": userInfo['NICKNAME'],
                    "EL_ID": userInfo.get('EL_ID'),  # 해당 필드가 없을 경우 None 반환
                    "SPEED": userInfo.get('SPEED'),
                    "is_admin": userInfo.get('is_admin', False),
                    "USER_CrtDt": userInfo.get('USER_CrtDt')
                })

                return jsonify({"token": token})
             else:
                return jsonify({"exists": False})
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            close_db_connection(connection)  # 연결 닫기 함수 사용
    return jsonify({"error": "Database connection failed"}), 500
