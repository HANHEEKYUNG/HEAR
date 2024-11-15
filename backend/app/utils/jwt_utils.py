import jwt
import datetime
import os

# 환경 변수에서 비밀 키 가져오기
secret_key = os.getenv('SECRET_KEY', 'default_secret_key')

def create_jwt_token(payload, expiration_hours=1):
    payload['exp'] = datetime.datetime.utcnow() + datetime.timedelta(hours=expiration_hours)
    return jwt.encode(payload, secret_key, algorithm="HS256")

def decode_jwt_token(token):
    try:
        return jwt.decode(token, secret_key, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
