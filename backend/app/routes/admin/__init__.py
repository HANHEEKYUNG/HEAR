from .wishbook_routes import wishbook_bp
from .admin_notice import admin_notice_bp
from .upload_history import upload_history_bp
from .category_counts import category_counts_bp
from .daily_signups import daily_signups_bp
from .recent_uploads import recent_uploads_bp
from .user_reading_rank import user_reading_rank_bp
from .bookAdd import bookAdd_bp

admin_blueprints = [wishbook_bp, admin_notice_bp, upload_history_bp, category_counts_bp, 
                    daily_signups_bp, recent_uploads_bp, user_reading_rank_bp, bookAdd_bp]
