
#from flask_session import Session
from flask_restful import reqparse
from flask_restful import Resource, Api
from flask_restful import fields, marshal
from flask import Flask
from wtforms import StringField, BooleanField
from application import config
from application.config import LocalDevelopmentConfig
from application.database import db
from flask_security import Security, SQLAlchemySessionUserDatastore, SQLAlchemyUserDatastore, auth_required, UserDatastore, registerable
from application.models import *
#from flask_login import LoginManager

from flask_mail import Mail
#from application import workers
#from application import tasks
#from flask_cors import CORS, cross_origin

app= None


#celery=Celery("Application Jobs",backend="redis://localhost:6379/1",broker="redis://localhost:6379/2")


def create_app():
    


    app=Flask(__name__)
    
    app.secret_key='13sourAV$'
    
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    app.config['SECURITY_CHANGEABLE']=True
    #cors = CORS(app)
    #app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///database.sqlite3'
    app.config['SECURITY_REGISTERABLE'] = True
    app.config['SECURITY_RECOVERABLE'] = True
    app.config['SECURITY_SEND_PASSWORD_RESET_EMAIL'] = True
    app.config['SECURITY_EMAIL_SUBJECT_PASSWORD_RESET'] = 'OFTEN- Password Reset Link'
    app.config['SECURITY_RESET_PASSWORD_TEMPLATE'] = 'reset_password.html'
    app.config['SECURITY_POST_RESET_VIEW'] = 'home.html'
    app.config['SECURITY_POST_LOGIN_VIEW'] = 'http://localhost:5000/'
    
    
    app.config['SECURITY_SEND_PASSWORD_RESET_NOTICE_EMAIL'] = False
    
    
    app.config['SECURITY_SEND_REGISTER_EMAIL']=False
    #app.config['SECURITY_CONFIRMABLE'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECURITY_SEND_PASSWORD_CHANGE_EMAIL']=False
    
    app.app_context().push()
    app.config['MAIL_SERVER'] = 'localhost'
    app.config['MAIL_PORT'] = 1025
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = "username@gmail.com"
    app.config['MAIL_PASSWORD'] = "password"
    mail = Mail(app)

    from flask_security import RegisterForm
    from wtforms import StringField, IntegerField
    from wtforms.validators import DataRequired

    
    class ExtendedRegisterForm(RegisterForm):
        t_id = IntegerField('t_id')
        phone=StringField('phone')

    db.create_all()
 #   user_datastore = SQLAlchemySessionUserDatastore(db.session, Users, Role)
 #   security = Security(app, user_datastore,register_form=ExtendedRegisterForm)
    # Setup Flask-Security
    
    #security = Security(app, user_datastore)
    
    
    #security = Security(app, user_datastore)
    return app


app = create_app()

from application.controllers.user_c import *
from application.api.api_vue import *

from application.tasks2 import *
from application.workers2 import *
    

    
if __name__=='__main__':
    
    app.run(debug=True)
            #ssl_context=("cert.perm", "key.pem"))
    

