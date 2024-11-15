from flask import Blueprint, request, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

verify_code_bp = Blueprint('verify_code', __name__)

@verify_code_bp.route('/verify-disability-code', methods=['POST'])
def verify_disability_code():
    data = request.json  # Get JSON data from React
    code = data.get('code')

    if not code:
        return jsonify({'success': False, 'message': '코드를 입력해주세요.'}), 400

    # Connect to the MySQL database
    connection = get_db_connection()

    if connection:
        try:
            # Query to check if the code exists and is active
            query = text("SELECT * FROM disability_code WHERE code = :code AND is_active = FALSE")
            result = connection.execute(query, {"code": code})
            code_info = result.fetchone()

            if code_info:
                code_info = dict(zip(result.keys(), code_info))
                return jsonify({'success': True, 'message': '코드가 인증되었습니다.', 'code_info': code_info}), 200
            else:
                return jsonify({'success': False, 'message': '유효하지 않은 코드입니다.'}), 404
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({'error': 'Database operation failed'}), 500
        finally:
            close_db_connection(connection)  # Close the connection
    return jsonify({'error': 'Database connection failed'}), 500
