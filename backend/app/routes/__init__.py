from app.routes.auth import auth_blueprints
from app.routes.voice import voice_blueprints
from app.routes.predict import predict_blueprints
from app.routes.board import board_blueprints  # 추가
from app.routes.study import wishbook_blueprint
from app.routes.STT import stt_blueprint
from app.routes.TTS import tts_blueprint
from app.routes.admin import admin_blueprints
from app.routes.notification import notification_blueprints

def register_blueprints(app):
    # 인증 관련 블루프린트 등록
    for bp in auth_blueprints:
        app.register_blueprint(bp, url_prefix='/api')

    # 음성 관련 블루프린트 등록
    for bp in voice_blueprints:
        app.register_blueprint(bp, url_prefix='/api')
    
    # 예측 관련 블루프린트 등록
    for bp in predict_blueprints:
        app.register_blueprint(bp, url_prefix='/api')

    # 공지사항 관련 블루프린트 등록
    for bp in board_blueprints:
        app.register_blueprint(bp, url_prefix='/api')

    # 내 서재 관련 블루프린트 등록
    for bp in wishbook_blueprint:
        app.register_blueprint(bp, url_prefix='/api')

    for bp in stt_blueprint:
        app.register_blueprint(bp, url_prefix='/api')

    for bp in tts_blueprint:
        app.register_blueprint(bp, url_prefix='/api')

    # 관리자 화면 블루프린트 등록
    for bp in admin_blueprints:
        app.register_blueprint(bp, url_prefix='/api')

    # 알림 관련 블루프린트 등록
    for bp in notification_blueprints:
        app.register_blueprint(bp, url_prefix='/api')

