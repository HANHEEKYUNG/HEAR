from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
import datetime


# 읽고 있는 도서 저장
librarySave_bp = Blueprint("library_save", __name__)


@librarySave_bp.route("/library-save", methods=["POST"])
def library_save():
    print("1번입니다.")

    data = request.get_json()

    print("2번입니다", data)
    userSeq = data.get("userSeq")
    bookSeq = data.get("bookSeq")
    histDiv = data.get("histDiv")
    time = data.get("time")
    # 초를 timedelta로 변환
    time_delta = datetime.timedelta(seconds=time)

    # HH:MM:SS 형식으로 변환
    time = str(time_delta).split(".")[0]
    print(userSeq, bookSeq, histDiv, time)

    connection = get_db_connection()
    if connection:

        try:
            # USER_SEQ 와 BOOK_SEQ 조인

            query = text(
                "SELECT count(*) FROM history where USER_SEQ = :userSeq AND BOOK_SEQ = :bookSeq"
            )
            result = connection.execute(query, {"userSeq": userSeq, "bookSeq": bookSeq})
            count = result.fetchone()[0] if result else 0

            if count > 0:
                print(time, "시간")
                query = text(
                    """
                        UPDATE history 
                        SET HIST_DIV = :histDiv, 
                            HIST_EdPt = :time, 
                            HIST_VwDt = NOW()
                        WHERE USER_SEQ = :userSeq AND BOOK_SEQ = :bookSeq
                    """
                )
                result = connection.execute(
                    query,
                    {
                        "userSeq": userSeq,
                        "bookSeq": bookSeq,
                        "time": time,
                        "histDiv": histDiv,
                    },
                )
               

                return jsonify({"message": "완료" }), 200
            else:
                query = text(
                    """ INSERT INTO history (USER_SEQ, BOOK_SEQ, HIST_DIV, HIST_EdPt, HIST_VwDt) 
                    VALUES (:userSeq, :bookSeq, :histDiv,  :time, NOW()) """
                )

                result = connection.execute(
                    query,
                    {
                        "userSeq": userSeq,
                        "bookSeq": bookSeq,
                        "histDiv": histDiv,
                        "time": time,
                    },
                )
              
                

                return jsonify({"data": data})

        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch librarySave"}), 500

        finally:
            # 데이터베이스 연결 닫기
            connection.commit()
            close_db_connection(connection)
    return jsonify({"error": "Database connection failed"}), 500
