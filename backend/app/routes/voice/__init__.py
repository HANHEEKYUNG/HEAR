from .voice_routes import voice_routes
from .user_settings_routes import user_settings_bp

# 음성 관련 블루프린트 리스트
voice_blueprints = [voice_routes, user_settings_bp]
