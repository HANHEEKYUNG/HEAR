from flask import Blueprint, jsonify, request
from app.utils.sse_utils import get_sse_response
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

notification_bp = Blueprint('notification', __name__)

# SSE 스트림 엔드포인트
@notification_bp.route('/notification/stream', methods=['GET'])
def stream():
    return get_sse_response()

# 알림 가져오기 엔드포인트
@notification_bp.route('/notification/notifications', methods=['GET'])
def get_notifications():
    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                SELECT 
                    n.NOTI_SEQ, 
                    n.USER_SEQ, 
                    u.NICKNAME, 
                    n.NOTI_TYPE, 
                    n.REF_SEQ, 
                    n.NOTI_READ_YN, 
                    n.NOTI_CREATE_DT
                FROM notifications n
                JOIN user u ON n.USER_SEQ = u.USER_SEQ
                WHERE n.NOTI_READ_YN = 'N'
                ORDER BY n.NOTI_CREATE_DT DESC
            """)
            result = connection.execute(query)
            notifications = [row._asdict() for row in result.fetchall()]

            return jsonify(notifications), 200
        except Exception as db_error:
            print(f"Failed to fetch notifications: {db_error}")
            return jsonify({"error": "Failed to fetch notifications"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 알림 확인 엔드포인트
@notification_bp.route('/notification/read/<int:noti_seq>', methods=['PUT'])
def mark_notification_as_read(noti_seq):
    connection = get_db_connection()
    if connection:
        try:
            # 알림 읽음 처리
            update_query = text("""
                UPDATE notifications 
                SET NOTI_READ_YN = 'Y',
                    NOTI_READ_DT = CURRENT_TIMESTAMP 
                WHERE NOTI_SEQ = :noti_seq
            """)
            
            connection.execute(update_query, {'noti_seq': noti_seq})
            connection.commit()

            return jsonify({"message": "Notification marked as read successfully"}), 200
            
        except Exception as db_error:
            connection.rollback()
            print(f"Failed to mark notification as read: {db_error}")
            return jsonify({"error": "Failed to mark notification as read"}), 500
            
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 알림 모두 읽음 처리 엔드 포인트
@notification_bp.route('/notification/read-all', methods=['PUT'])
def mark_all_notifications_as_read():
    connection = get_db_connection()
    if connection:
        try:
            update_query = text("""
                UPDATE notifications 
                SET NOTI_READ_YN = 'Y',
                    NOTI_READ_DT = CURRENT_TIMESTAMP 
                WHERE NOTI_READ_YN = 'N'
            """)
            
            connection.execute(update_query)
            connection.commit()
            return jsonify({"message": "All notifications marked as read"}), 200
            
        except Exception as db_error:
            connection.rollback()
            print(f"Failed to mark all notifications as read: {db_error}")
            return jsonify({"error": "Failed to mark all notifications as read"}), 500
            
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500