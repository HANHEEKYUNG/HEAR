from flask import Response, stream_with_context
from queue import Queue
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

clients = []

def event_stream():
    q = Queue()
    clients.append(q)
    try:
        while True:
            message = q.get()  # 대기 중에 새 메시지가 큐에 오면 전송
            yield f"data: {message}\n\n"
    except GeneratorExit:
        clients.remove(q)

def send_notification(user_seq, noti_type, ref_seq, additional_info=None):
    connection = get_db_connection()
    nickname = None
    if connection:
        try:
            # 닉네임 조회
            query = text("SELECT NICKNAME FROM user WHERE USER_SEQ = :user_seq")
            result = connection.execute(query, {"user_seq": user_seq}).fetchone()
            if result:
                nickname = result[0]
        except Exception as db_error:
            print(f"Failed to fetch nickname: {db_error}")
        finally:
            close_db_connection(connection)

    # 알림 데이터를 구성
    notification_data = {
        "user_seq": user_seq,
        "nickname": nickname,  # 닉네임 추가
        "type": noti_type,
        "ref_seq": ref_seq
    }

    if additional_info:
        notification_data.update(additional_info)

    for client in clients:
        print(f"Sending notification to client: {notification_data}")  # 디버깅 로그 추가
        client.put(notification_data)

def get_sse_response():
    return Response(stream_with_context(event_stream()), content_type='text/event-stream')

def save_notification(user_seq, noti_type, ref_seq):
    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                INSERT INTO notifications (USER_SEQ, NOTI_TYPE, REF_SEQ, NOTI_READ_YN)
                VALUES (:user_seq, :noti_type, :ref_seq, 'N')
            """)
            connection.execute(query, {
                "user_seq": user_seq,
                "noti_type": noti_type,
                "ref_seq": ref_seq
            })
            connection.commit()  # 변경 사항 적용
        except Exception as db_error:
            print(f"Failed to save notification: {db_error}")
        finally:
            close_db_connection(connection)