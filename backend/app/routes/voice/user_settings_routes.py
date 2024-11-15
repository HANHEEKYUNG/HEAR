from flask import Blueprint, request, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

user_settings_bp = Blueprint('user_settings', __name__)

@user_settings_bp.route('/voice/settings', methods=['POST'])
def save_user_settings():
    try:
        data = request.json
        user_seq = data.get("user_seq")
        selected_voice = data.get("selectedVoice")
        speed = data.get("speed")

        # MySQL 연결
        connection = get_db_connection()

        if connection:
            try:
                # 사용자 설정을 업데이트하는 쿼리 실행
                query = text("""
                    UPDATE user
                    SET speed = :speed
                      , EL_ID = :selected_voice
                    WHERE user_seq = :user_seq
                """)
                connection.execute(query, {
                    "selected_voice": selected_voice,
                    "speed": speed,
                    "user_seq": user_seq
                })
                connection.commit()  # 변경 사항 저장

                return jsonify({"message": "Settings saved successfully."}), 200
            except Exception as db_error:
                print(f"Database operation failed: {db_error}")
                return jsonify({"error": "Database operation failed"}), 500
            finally:
                close_db_connection(connection)  # 연결 닫기
        return jsonify({"error": "Database connection failed"}), 500
    except Exception as e:
        print(f"Error saving user settings: {e}")
        return jsonify({"error": "Failed to save settings."}), 500
