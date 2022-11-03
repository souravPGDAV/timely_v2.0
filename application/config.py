import os

basedir=os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG=False
    SQLITE_DB_DIR=None
    SQLALCHEMY_DATABASE_URI=None
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    VUE_PATH='<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>'
    WTF_CSRF_ENABLED=False
    
    
    

class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR=os.path.join(basedir,".../files")
    SQLALCHEMY_DATABASE_URI="sqlite:///"+os.path.join("database.sqlite3")
    SECURITY_PASSWORD_SALT = "really super secret" # Read from ENV in your case
    SECURITY_PASSWORD_HASH = "bcrypt"
    CELERY_BROKER_URL="redis://localhost:6379/1"
    CELERY_RESULT_BACKEND="redis://localhost:6379/2"
    UPLOAD_FOLDER = 'application/csv_files/uploads'
    
    
