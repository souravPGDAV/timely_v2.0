import os
from application.database import db
#imported db as celery beat was not working with application.
from flask_security import UserMixin, RoleMixin
from flask_login import login_manager




class Teachers(db.Model):
    t_id=db.Column(db.Integer,db.ForeignKey('users.user_id'),primary_key=True,nullable=True)
    fname=db.Column(db.String(255),nullable=False)
    lname=db.Column(db.String(255),nullable=False)
    subject=db.Column(db.String(255),nullable=False)    
    contradictions=db.Column(db.Integer,default=0)
    helps=db.Column(db.Integer,default=0)
   
class classes(db.Model):
    class_id=db.Column(db.Integer, autoincrement=True,primary_key=True)
    teacher_id=db.Column(db.Integer,db.ForeignKey('teachers.t_id'),nullable=False)
    day=db.Column(db.Integer,nullable=False)
    start_time=db.Column(db.String(5),nullable=False)
    end_time=db.Column(db.String(5),nullable=False)
    status=db.Column(db.Integer,nullable=False,default=0)
    room=db.Column(db.Integer,nullable=False)
    contradicted=db.Column(db.Boolean())
    last_updated=db.Column(db.DateTime)
    absence=db.Column(db.Integer,default=0)

class classes_o(db.Model):
    class_id=db.Column(db.Integer, autoincrement=True,primary_key=True)
    start_time=db.Column(db.String(5),nullable=False)
    end_time=db.Column(db.String(5),nullable=False)
    room=db.Column(db.Integer,nullable=False)
    

class Users(db.Model):
    user_id=db.Column(db.Integer, autoincrement=True,primary_key=True)
    email=db.Column(db.String(255), unique=True, nullable=False)
    token=db.Column(db.String(255),nullable=False,unique=True)    

class Students(db.Model):
    s_id=db.Column(db.Integer,db.ForeignKey('users.user_id'),primary_key=True,nullable=True)
    family=db.Column(db.String(10),nullable=False)
    #helps=db.Column(db.Integer,default=0)
    votes=db.Column(db.String(10))

class Proba(db.Model):
    class_id=db.Column(db.Integer,db.ForeignKey('classes.class_id'),nullable=False,primary_key=True)
    status=db.Column(db.Integer,nullable=False,primary_key=True)
    final=db.Column(db.Integer,nullable=False)
